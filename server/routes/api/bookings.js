
import express from 'express';
const router = express.Router();
import auth from '../../middleware/auth.js';
import Booking from '../../models/Booking.js';
import User from '../../models/User.js';
router.post('/', auth, async (req, res) => {
    // Frontend se humein artisan ki ID milegi
    const { artisanId } = req.body;
    try {
    // Check karo ki yeh artisan pehle se hi kisi kaam par toh nahi hai
        // Hum aisi koi bhi booking dhoond rahe hain jo 'Work Complete', 'Payment Done', ya 'Cancelled' NAHI hai.
        const existingBooking = await Booking.findOne({ 
            artisan: artisanId, 
            status: { $nin: ['Work Complete', 'Payment Done', 'Cancelled'] } 
        });

        // Agar aisi koi booking milti hai, toh matlab artisan busy hai
        if (existingBooking) {
            return res.status(400).json({ msg: 'Artisan is currently busy on another job.' });
        }

        // Step B: Agar artisan free hai, toh nayi booking banao
        const newBooking = new Booking({
            customer: req.user.id,
            artisan: artisanId,    
        });

        // Step C: Nayi booking ko database mein save karo
        const booking = await newBooking.save();
        // Frontend ko success ka message aur booking details bhej do
        res.status(201).json(booking);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/my-jobs', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ artisan: req.user.id })
            .populate('customer', 'name email') // Customer ki details bhi le aao
            .sort({ createdAt: -1 }); // Sabse nayi booking sabse upar
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/bookings/:bookingId/status
// @desc    Ek booking ka status update karna
// @access  Private (Sirf Artisan)
router.put('/:bookingId/status', auth, async (req, res) => {
    const { status } = req.body; // Naya status frontend se aayega
    const { bookingId } = req.params; // Booking ki ID URL se aayegi
    try {
        let booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }
        if (booking.artisan.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        booking.status = status;
        await booking.save();
        res.json(booking); // Updated booking wapas bhej do
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/my-orders', auth, async (req, res) => {
    try {
        // Database mein aisi bookings dhoondo jahan customer ki ID logged-in user ki ID hai
        const bookings = await Booking.find({ customer: req.user.id })
            .populate('artisan', 'name artisanInfo') // Artisan ki details (naam, service) bhi le aao
            .sort({ createdAt: -1 }); // Sabse nayi booking sabse upar

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;