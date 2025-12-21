import express from 'express';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import auth from '../../middleware/auth.js';
import admin from '../../middleware/admin.js';
import Booking from '../../models/Booking.js';
import Payment from '../../models/Payment.js';
import User from '../../models/User.js';
import Wallet from '../../models/Wallet.js';
import { getRazorpayClient, razorpayPublicKey } from '../../config/razorpay.js';

const router = express.Router();

async function getOrCreateWallet(userId) {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = new Wallet({ user: userId, balance: 0, transactions: [] });
    await wallet.save();
  }
  return wallet;
}

function pushTransaction(wallet, { amount, type, source, reference, description }) {
  const balance = type === 'credit' ? wallet.balance + amount : wallet.balance - amount;
  wallet.transactions.unshift({ amount, type, source, reference, description, balanceAfter: balance });
  wallet.balance = balance;
}

router.post('/order', auth, async (req, res) => {
  try {
    const { bookingId, amount, currency = 'INR', useWallet = false, purpose = 'booking', description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Amount must be greater than zero.' });
    }

    let booking = null;
    let artisanId = req.body.artisanId;

    if (purpose === 'booking') {
      booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ msg: 'Booking not found' });
      }
      if (booking.customer.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not allowed for this booking' });
      }
      artisanId = booking.artisan;
    }

    if (!artisanId) {
      artisanId = req.user.id;
    }

    if (useWallet) {
      const wallet = await getOrCreateWallet(req.user.id);
      if (wallet.balance < amount) {
        return res.status(400).json({ msg: 'Insufficient wallet balance' });
      }
      pushTransaction(wallet, {
        amount,
        type: 'debit',
        source: 'wallet',
        reference: bookingId || 'wallet-spend',
        description: description || 'Wallet payment'
      });
      await wallet.save();

      const payment = await Payment.create({
        customer: req.user.id,
        artisan: artisanId,
        booking: booking ? booking._id : null,
        amount,
        currency,
        description,
        source: 'wallet',
        status: 'escrow',
        escrow: purpose === 'booking',
        paidAt: new Date(),
        metadata: { purpose }
      });

      return res.json({
        paymentId: payment._id,
        status: payment.status,
        escrow: payment.escrow,
        walletBalance: wallet.balance
      });
    }

    const razorpay = getRazorpayClient();
    const receipt = `cc_${Date.now()}`;
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
      notes: { bookingId: bookingId || '', customer: req.user.id, artisan: artisanId }
    });

    const payment = await Payment.create({
      customer: req.user.id,
      artisan: artisanId,
      booking: booking ? booking._id : null,
      amount,
      currency,
      description,
      source: 'razorpay',
      status: 'created',
      razorpayOrderId: order.id,
      receipt,
      metadata: { purpose }
    });

    res.json({
      key: razorpayPublicKey,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
      receipt
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err.message);
    res.status(500).json({ msg: 'Unable to create payment order' });
  }
});

router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ msg: 'Missing payment verification fields' });
    }

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id, customer: req.user.id });
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found for this user' });
    }

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ msg: 'Signature verification failed' });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.paidAt = new Date();

    let wallet;
    if (payment.metadata?.purpose === 'wallet-topup') {
      wallet = await getOrCreateWallet(req.user.id);
      pushTransaction(wallet, {
        amount: payment.amount,
        type: 'credit',
        source: 'razorpay',
        reference: payment._id.toString(),
        description: 'Wallet top-up via Razorpay'
      });
      payment.status = 'released';
      payment.escrow = false;
      payment.metadata.topupCredited = true;
      await wallet.save();
    } else {
      payment.status = 'escrow';
      payment.escrow = true;
    }

    await payment.save();

    res.json({
      msg: 'Payment verified',
      status: payment.status,
      paymentId: payment._id,
      walletBalance: wallet ? wallet.balance : undefined
    });
  } catch (err) {
    console.error('Verify payment error:', err.message);
    res.status(500).json({ msg: 'Could not verify payment' });
  }
});

router.post('/release/:paymentId', auth, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }

    const user = await User.findById(req.user.id);
    const isAdmin = user?.isAdmin;
    const isCustomer = payment.customer.toString() === req.user.id;

    if (!isAdmin && !isCustomer) {
      return res.status(403).json({ msg: 'Not authorized to release this payment' });
    }

    if (payment.status !== 'escrow') {
      return res.status(400).json({ msg: 'Payment is not in escrow' });
    }

    let booking;
    if (payment.booking) {
      booking = await Booking.findById(payment.booking);
      if (booking && booking.status !== 'Work Complete' && !isAdmin) {
        return res.status(400).json({ msg: 'Work is not marked complete yet' });
      }
    }

    const artisanWallet = await getOrCreateWallet(payment.artisan);
    pushTransaction(artisanWallet, {
      amount: payment.amount,
      type: 'credit',
      source: 'escrow-release',
      reference: payment._id.toString(),
      description: 'Payout from escrow'
    });

    payment.status = 'released';
    payment.escrow = false;
    payment.releasedAt = new Date();

    if (booking) {
      booking.status = 'Payment Done';
      await booking.save();
    }

    await artisanWallet.save();
    await payment.save();

    res.json({
      msg: 'Escrow released to artisan',
      paymentId: payment._id,
      artisanWalletBalance: artisanWallet.balance
    });
  } catch (err) {
    console.error('Release payment error:', err.message);
    res.status(500).json({ msg: 'Could not release payment' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [{ customer: req.user.id }, { artisan: req.user.id }]
    }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error('Payment history error:', err.message);
    res.status(500).json({ msg: 'Unable to fetch payment history' });
  }
});

router.get('/wallet', auth, async (req, res) => {
  try {
    const wallet = await getOrCreateWallet(req.user.id);
    res.json(wallet);
  } catch (err) {
    console.error('Wallet fetch error:', err.message);
    res.status(500).json({ msg: 'Unable to fetch wallet' });
  }
});

router.get('/invoice/:paymentId', auth, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId)
      .populate('customer', 'name email')
      .populate('artisan', 'name email')
      .populate('booking');

    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }

    const user = await User.findById(req.user.id);
    const isAdmin = user?.isAdmin;
    const isParticipant = [payment.customer?.id, payment.artisan?.id].includes(req.user.id);
    if (!isAdmin && !isParticipant) {
      return res.status(403).json({ msg: 'Not authorized to view this invoice' });
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=invoice-${paymentId}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('CraftConnect Invoice', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice #: ${payment.invoiceNumber || paymentId}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Payment Status: ${payment.status}`);
    doc.moveDown();

    doc.text(`Billed To: ${payment.customer?.name || 'Customer'}`);
    doc.text(`Email: ${payment.customer?.email || ''}`);
    doc.moveDown();

    doc.text(`Artisan: ${payment.artisan?.name || ''}`);
    doc.text(`Booking: ${payment.booking ? payment.booking.id : 'N/A'}`);
    doc.moveDown();

    doc.text(`Amount: ₹${payment.amount.toFixed(2)} ${payment.currency}`);
    doc.text(`Source: ${payment.source}`);
    doc.text(`Escrow: ${payment.escrow ? 'Yes' : 'No'}`);
    doc.text(`Paid At: ${payment.paidAt ? new Date(payment.paidAt).toLocaleString() : 'Pending'}`);
    doc.text(`Released At: ${payment.releasedAt ? new Date(payment.releasedAt).toLocaleString() : 'Pending'}`);

    doc.end();
  } catch (err) {
    console.error('Invoice generation error:', err.message);
    res.status(500).json({ msg: 'Unable to generate invoice' });
  }
});

router.post('/wallet/topup', auth, async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Amount must be greater than zero.' });
    }

    const razorpay = getRazorpayClient();
    const receipt = `wallet_${Date.now()}`;
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
      notes: { purpose: 'wallet-topup', customer: req.user.id }
    });

    const payment = await Payment.create({
      customer: req.user.id,
      artisan: req.user.id,
      amount,
      currency,
      source: 'razorpay',
      status: 'created',
      razorpayOrderId: order.id,
      receipt,
      escrow: false,
      metadata: { purpose: 'wallet-topup' }
    });

    res.json({
      key: razorpayPublicKey,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
      receipt
    });
  } catch (err) {
    console.error('Wallet topup error:', err.message);
    res.status(500).json({ msg: 'Unable to create wallet top-up order' });
  }
});

router.post('/wallet/refund/:paymentId', auth, admin, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    if (payment.status !== 'escrow' && payment.status !== 'released') {
      return res.status(400).json({ msg: 'Only escrow or released payments can be refunded' });
    }

    if (payment.status === 'released') {
      const artisanWallet = await getOrCreateWallet(payment.artisan);
      if (artisanWallet.balance < payment.amount) {
        return res.status(400).json({ msg: 'Insufficient artisan wallet balance for refund' });
      }
      pushTransaction(artisanWallet, {
        amount: payment.amount,
        type: 'debit',
        source: 'refund',
        reference: payment._id.toString(),
        description: 'Admin refund'
      });
      await artisanWallet.save();
    }

    const customerWallet = await getOrCreateWallet(payment.customer);
    pushTransaction(customerWallet, {
      amount: payment.amount,
      type: 'credit',
      source: 'refund',
      reference: payment._id.toString(),
      description: 'Refund to customer'
    });
    await customerWallet.save();

    payment.status = 'refunded';
    payment.escrow = false;
    await payment.save();

    res.json({ msg: 'Payment refunded', paymentId: payment._id });
  } catch (err) {
    console.error('Refund error:', err.message);
    res.status(500).json({ msg: 'Unable to process refund' });
  }
});

export default router;
