import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },

  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  description: { type: String },

  source: { type: String, enum: ['razorpay', 'wallet'], default: 'razorpay' },
  status: {
    type: String,
    enum: ['created', 'authorized', 'captured', 'escrow', 'released', 'refunded', 'failed'],
    default: 'created'
  },
  escrow: { type: Boolean, default: true },

  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  receipt: { type: String },

  paidAt: { type: Date },
  releasedAt: { type: Date },
  refundId: { type: String },

  metadata: { type: mongoose.Schema.Types.Mixed },
  invoiceNumber: { type: String },
  invoiceDate: { type: Date },
}, { timestamps: true });

PaymentSchema.index({ customer: 1, createdAt: -1 });
PaymentSchema.index({ artisan: 1, createdAt: -1 });
PaymentSchema.index({ booking: 1 });
PaymentSchema.index({ razorpayOrderId: 1 });

export default mongoose.model('Payment', PaymentSchema);
