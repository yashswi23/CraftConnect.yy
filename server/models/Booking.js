
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const BookingSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId, 
        ref: 'User',                 
        required: true
    },
    // Kaunsa artisan book ho raha hai?
    artisan: {
        type: Schema.Types.ObjectId, // Artisan ki unique ID
        ref: 'User',                 // Yeh ID bhi 'User' model se hi aayegi
        required: true
    },
    // Booking kab hui?
    bookingDate: {
        type: Date,
        default: Date.now // Apne aap abhi ka time daal dega
    },
    // Booking ka current status kya hai?
    status: {
        type: String,
        enum: [ // Status sirf inmein se hi koi ek ho sakta hai
            'Pending Confirmation',
            'Confirmed',
            'On The Way',
            'Arrived',
            'Work In Progress',
            'Work Complete',
            'Payment Done',
            'Cancelled'
        ],
        default: 'Pending Confirmation' // Shuru mein status yeh rahega
    }
}, { timestamps: true }); // Yeh 'createdAt' aur 'updatedAt' time apne aap add kar dega

export default mongoose.model('Booking', BookingSchema);