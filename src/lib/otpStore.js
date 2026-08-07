// Simple in-memory OTP store (dev-scale, no external dependency).
// Note: resets on server restart and won't work across multiple server instances.
const store = new Map();

export function setOtp(key, otp, ttlMs) {
  store.set(key, { otp, expiresAt: Date.now() + ttlMs });
}

export function verifyOtp(key, otp) {
  const entry = store.get(key);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return false;
  }
  if (entry.otp !== otp) return false;
  store.delete(key);
  return true;
}
