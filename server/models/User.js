// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: {
//         type: String,
//         enum: ['customer', 'artisan'],
//         default: 'customer'
//     },
//     artisanInfo: {
//         location: { type: String },
//         verifiedMobile: { type: String }, // Verified mobile number
//         serviceCategory: { type: String }, // Dropdown se aayega
//         verificationType: { 
//             type: String, 
//             enum: ['MOBILE_OTP', 'AADHAAR_OCR', 'MANUAL'], 
//             default: 'MOBILE_OTP' 
//         },
//         status: {
//             type: String,
//             enum: ['pending', 'approved', 'rejected'],
//             default: 'pending'
//         },
//         rating:{type:Number,default:0},
//         totalRatings:{type:Number, default:0}
//     }
//     ,
//     isAdmin:{type:Boolean, default:false}
// }, { timestamps: true });

// export default mongoose.model('User', UserSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
        type: String,
        enum: ['customer', 'artisan'],
        default: 'customer'
    },

    // 🔐 VERIFICATION FIELDS
    mobileNumber: { type: String },        // User's phone number
    mobileVerified: { type: Boolean, default: false }, // OTP Verified?
    aadhaarNumber: { type: String },
    aadhaarVerified: { type: Boolean, default: false }, // OCR Verified?
    mobileOtp: { type: String },        // OTP code sent to user
    mobileOtpExpiry: { type: Date },     // Expiry time


    // 🎨 ARTISAN DATA
    artisanInfo: {
        location: { type: String },
        serviceCategory: { type: String },

        verificationType: { 
            type: String, 
            enum: ['MOBILE_OTP', 'AADHAAR_OCR', 'MANUAL'], 
            default: 'MOBILE_OTP' 
        },

        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },

        rating:{type:Number,default:0},
        totalRatings:{type:Number, default:0}
    },

    isAdmin: { type:Boolean, default:false }

}, { timestamps: true });

export default mongoose.model('User', UserSchema);
