import mongoose from "mongoose";

const WalletTransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  source: { type: String, enum: ['razorpay', 'wallet', 'escrow-release', 'refund', 'manual'], required: true },
  reference: { type: String },
  description: { type: String },
  balanceAfter: { type: Number },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const WalletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  balance: { type: Number, default: 0 },
  transactions: [WalletTransactionSchema]
}, { timestamps: true });

WalletSchema.index({ user: 1 }, { unique: true });

export default mongoose.model('Wallet', WalletSchema);
