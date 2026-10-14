// Simple in-memory OTP store (dev-scale, no external dependency).
// Note: resets on server restart and won't work across multiple server instances.
// Kept on globalThis so dev hot-reloads don't wipe OTPs that were already emailed.
const store = globalThis.__otpStore || (globalThis.__otpStore = new Map());

const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function setOtp(key, otp, ttlMs) {
  store.set(key, { otp, expiresAt: Date.now() + ttlMs, sentAt: Date.now(), attempts: 0 });
}

// Seconds the caller must wait before another OTP can be sent for this key (0 = can send now)
export function resendWaitSeconds(key) {
  const entry = store.get(key);
  if (!entry || Date.now() > entry.expiresAt) return 0;
  return Math.max(0, Math.ceil((entry.sentAt + RESEND_COOLDOWN_MS - Date.now()) / 1000));
}

export function verifyOtp(key, otp) {
  const entry = store.get(key);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return false;
  }
  if (entry.otp !== String(otp)) {
    entry.attempts += 1;
    // Too many wrong guesses: burn this OTP so it can't be brute-forced
    if (entry.attempts >= MAX_ATTEMPTS) store.delete(key);
    return false;
  }
  store.delete(key);
  return true;
}
