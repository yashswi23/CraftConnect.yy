import express from 'express';
import twilio from 'twilio';
import crypto from 'crypto';
import OTP from '../../models/OTP.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

// Twilio client initialization
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// Validate Indian mobile number
const isValidIndianMobile = (phone) => {
  const indianMobileRegex = /^[6-9]\d{9}$/;
  return indianMobileRegex.test(phone.replace(/\D/g, ''));
};

// Format phone number to international format
const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
};

// ========================
// 1️⃣ SEND OTP
// ========================
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber, purpose = 'AADHAAR_VERIFICATION' } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ msg: 'Phone number is required' });
    }

    // Validate phone number
    if (!isValidIndianMobile(phoneNumber)) {
      return res.status(400).json({ msg: 'Invalid Indian mobile number' });
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Check if there's a recent OTP (rate limiting)
    const recentOTP = await OTP.findOne({
      phoneNumber: formattedPhone,
      purpose,
      createdAt: { $gt: new Date(Date.now() - 60000) } // 1 minute ago
    });

    if (recentOTP) {
      return res.status(429).json({ 
        msg: 'Please wait 1 minute before requesting another OTP',
        remainingTime: Math.ceil((60000 - (Date.now() - recentOTP.createdAt)) / 1000)
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await OTP.create({
      phoneNumber: formattedPhone,
      otp,
      purpose,
      expiresAt
    });

    // For development/testing, we'll skip actual SMS and return OTP
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 OTP for ${formattedPhone}: ${otp}`);
      return res.json({
        success: true,
        msg: 'OTP sent successfully (Check console for development)',
        phoneNumber: formattedPhone,
        // Only in development
        devOTP: otp
      });
    }

    // Send SMS in production
    try {
      await twilioClient.messages.create({
        body: `Your CraftConnect verification OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone
      });

      res.json({
        success: true,
        msg: 'OTP sent successfully to your mobile number',
        phoneNumber: formattedPhone
      });
    } catch (twilioError) {
      console.error('Twilio Error:', twilioError);
      res.status(500).json({
        msg: 'Failed to send SMS. Please try again.',
        error: 'SMS_SEND_FAILED'
      });
    }

  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// ========================
// 2️⃣ VERIFY OTP
// ========================
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp, purpose = 'AADHAAR_VERIFICATION' } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ msg: 'Phone number and OTP are required' });
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      phoneNumber: formattedPhone,
      purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 }); // Get latest OTP

    if (!otpRecord) {
      return res.status(400).json({ 
        msg: 'Invalid or expired OTP',
        error: 'OTP_NOT_FOUND'
      });
    }

    // Check attempts limit
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        msg: 'Too many invalid attempts. Please request a new OTP.',
        error: 'MAX_ATTEMPTS_EXCEEDED'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp.toString()) {
      // Increment attempts
      await OTP.updateOne(
        { _id: otpRecord._id },
        { $inc: { attempts: 1 } }
      );

      return res.status(400).json({
        msg: `Invalid OTP. ${2 - otpRecord.attempts} attempts remaining.`,
        error: 'INVALID_OTP',
        attemptsLeft: 2 - otpRecord.attempts
      });
    }

    // OTP is valid - mark as used
    await OTP.updateOne(
      { _id: otpRecord._id },
      { isUsed: true }
    );

    res.json({
      success: true,
      msg: 'OTP verified successfully',
      phoneNumber: formattedPhone,
      verified: true
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// ========================
// 3️⃣ RESEND OTP
// ========================
router.post('/resend-otp', async (req, res) => {
  try {
    const { phoneNumber, purpose = 'AADHAAR_VERIFICATION' } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ msg: 'Phone number is required' });
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Delete old OTPs
    await OTP.deleteMany({
      phoneNumber: formattedPhone,
      purpose
    });

    // Generate and send new OTP (reuse send-otp logic)
    req.body.phoneNumber = phoneNumber;
    req.body.purpose = purpose;
    
    // Call send-otp endpoint internally
    return router.handle({ method: 'POST', url: '/send-otp', body: req.body }, res);

  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.post('/verify-otp-complete', auth, async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Update user fields
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        mobileNumber: formattedPhone,
        mobileVerified: true
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      msg: 'Mobile number verified and updated in user profile!',
      user
    });

  } catch (error) {
    console.error("Error linking OTP to user:", error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

export default router;