import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['AADHAAR_VERIFICATION', 'LOGIN', 'REGISTRATION'],
    default: 'AADHAAR_VERIFICATION'
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
otpSchema.index({ phoneNumber: 1, purpose: 1 });

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;