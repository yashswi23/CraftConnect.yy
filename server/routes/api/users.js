import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import auth from '../../middleware/auth.js';
import User from '../../models/User.js';
import admin from '../../middleware/admin.js';
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            "hamariSuperSecretKey123",
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            "hamariSuperSecretKey123",
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.put('/become-artisan', auth, async (req, res) => {
    const { location, serviceCategory, verifiedMobile, verificationType } = req.body;
    
    if (!location || !serviceCategory || !verifiedMobile) {
        return res.status(400).json({ msg: 'Please enter all required fields and verify mobile number' });
    }
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // <-- ADD THIS CHECK
        if (user.role === 'admin') {
            return res.status(403).json({ msg: 'Admins cannot apply to be artisans.' });
        }
        
        user.role = 'artisan';
        user.artisanInfo = {
            location,
            verifiedMobile,
            serviceCategory,
            verificationType: verificationType || 'MOBILE_OTP',
            status: 'pending'
        };

        await user.save();

        res.json({ msg: 'Application submitted! Waiting for admin approval.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/artisans', auth, async (req, res) => {
    try {
        const artisans = await User.find({
            role: 'artisan',
            'artisanInfo.status': 'approved'
        }).select('-password'); 
        res.json(artisans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// router.get('/artisan-applications',auth,admin,async(req,res)=>{
//     try {
//     const pendingApplications = await User.find({ "artisanInfo.status": "pending" }).select('-password');
//     res.json(pendingApplications);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });
router.get('/artisan-applications', auth, admin, async (req, res) => {
    try {
        const pendingApplications = await User.find({
            "artisanInfo.status": "pending",
            "role": { $ne: 'admin' } 
        }).select('-password');
        res.json(pendingApplications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// router.put('/approve-artisan/:id',auth,admin,async(req,res)=>{
//     console.log('Approve artisan route called with id:', req.params.id);
//     try{
//         const user = await User.findById(req.params.id);
//         if(!user || user.role !== 'artisan'){
//             return res.status(404).json({msg: 'Arstian Not Found'});
//         }
//         user.artisanInfo.status = 'approved';
//         await user.save();
//         res.json({msg: 'Artisan Approved!',user});
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });
router.put('/approve-artisan/:id', auth, admin, async (req, res) => {
  try {
    console.log('Approve artisan started for ID:', req.params.id);
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'artisan') {
      console.log('User not found or not artisan');
      return res.status(404).json({ msg: 'Artisan Not Found' });
    }
    user.artisanInfo.status = 'approved';
    await user.save();
    console.log('Artisan approved:', user);
    res.json({ msg: 'Artisan Approved!', user });
  } catch (err) {
    console.error('Error approving artisan:', err);
    res.status(500).send('Server Error');
  }
});


router.put('/reject-artisan/:id',auth,admin,async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user || user.role !== 'artisan' || !user.artisanInfo){
            return res.status(404).json({msg: 'Artisan not Found'});
        }
        user.artisanInfo.status = 'rejected';
        await user.save();
        res.json({msg: 'Artisan Rejected!',user});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// Rate an artisan
router.post('/rate/:artisanId', auth, async (req, res) => {
    const { rating } = req.body; // 1-5
    const { artisanId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    try {
        const artisan = await User.findById(artisanId);
        if (!artisan || artisan.role !== 'artisan') {
            return res.status(404).json({ msg: 'Artisan not found' });
        }

        // Update average rating
        const total = artisan.artisanInfo.rating * artisan.artisanInfo.totalRatings;
        const newTotalRatings = artisan.artisanInfo.totalRatings + 1;
        const newRating = (total + rating) / newTotalRatings;

        artisan.artisanInfo.rating = newRating;
        artisan.artisanInfo.totalRatings = newTotalRatings;

        await artisan.save();

        res.json({ msg: 'Rating submitted', rating: newRating });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.put("/update-location", auth, async (req, res) => {
  const { lat, lon, address } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { location: { lat, lon, address } },
    { new: true }
  );

  res.json(user);
});

export default router;


//new Admin Dashboard



