import Razorpay from 'razorpay';

let razorpayClient;

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

function ensureKeysPresent() {
  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys are missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment.');
  }
}

export function getRazorpayClient() {
  ensureKeysPresent();
  if (!razorpayClient) {
    razorpayClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return razorpayClient;
}

export const razorpayPublicKey = keyId;
