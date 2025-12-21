// server/routes/api/portfolio.js
import express from 'express';
const router = express.Router();
import auth from '../../middleware/auth.js';
import User from '../../models/User.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for portfolio image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/portfolio/'));
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// GET - Get artisan's profile (for editing)
router.get('/my-profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user || user.role !== 'artisan') {
            return res.status(403).json({ msg: 'Access denied. Artisans only.' });
        }

        res.json({
            bio: user.artisanInfo.bio || '',
            skills: user.artisanInfo.skills || [],
            experience: user.artisanInfo.experience || '',
            portfolio: user.artisanInfo.portfolio || []
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT - Update artisan profile (bio, skills, experience)
router.put('/update-profile', auth, async (req, res) => {
    const { bio, skills, experience } = req.body;

    try {
        const user = await User.findById(req.user.id);
        
        if (!user || user.role !== 'artisan') {
            return res.status(403).json({ msg: 'Access denied. Artisans only.' });
        }

        if (bio !== undefined) user.artisanInfo.bio = bio;
        if (skills !== undefined) user.artisanInfo.skills = skills;
        if (experience !== undefined) user.artisanInfo.experience = experience;

        await user.save();
        res.json({ msg: 'Profile updated successfully!', artisanInfo: user.artisanInfo });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST - Add portfolio item (with image upload)
router.post('/add-work', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ msg: 'Title is required' });
        }

        const user = await User.findById(req.user.id);
        
        if (!user || user.role !== 'artisan') {
            return res.status(403).json({ msg: 'Access denied. Artisans only.' });
        }

        const portfolioItem = {
            title,
            description: description || '',
            imageUrl: req.file ? `/uploads/portfolio/${req.file.filename}` : '',
            createdAt: new Date()
        };

        if (!user.artisanInfo.portfolio) {
            user.artisanInfo.portfolio = [];
        }

        user.artisanInfo.portfolio.push(portfolioItem);
        await user.save();

        res.status(201).json({ 
            msg: 'Work added to portfolio!', 
            portfolio: user.artisanInfo.portfolio 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE - Remove portfolio item
router.delete('/delete-work/:itemId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user || user.role !== 'artisan') {
            return res.status(403).json({ msg: 'Access denied. Artisans only.' });
        }

        if (!user.artisanInfo.portfolio) {
            return res.status(404).json({ msg: 'No portfolio items found' });
        }

        user.artisanInfo.portfolio = user.artisanInfo.portfolio.filter(
            item => item._id.toString() !== req.params.itemId
        );

        await user.save();
        res.json({ msg: 'Portfolio item deleted!', portfolio: user.artisanInfo.portfolio });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
