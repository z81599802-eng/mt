import { hashOtp, verifyOtp } from '../utils/otp.js';
import { logger } from '../utils/logger.js';

const OTP_STORE = new Map<string, { hash: string; expiresAt: number }>();
const OTP_TTL_MS = 5 * 60 * 1000;

export function createOtp(phone: string, otp: string) {
  const secret = process.env.OTP_SECRET ?? 'otp-secret';
  const hash = hashOtp(otp, secret);
  OTP_STORE.set(phone, { hash, expiresAt: Date.now() + OTP_TTL_MS });
  logger.info('Mock OTP generated', { phone });
}

export function validateOtp(phone: string, otp: string): boolean {
  const secret = process.env.OTP_SECRET ?? 'otp-secret';
  const record = OTP_STORE.get(phone);
  if (!record || record.expiresAt < Date.now()) {
    OTP_STORE.delete(phone);
    return false;
  }
  const isValid = verifyOtp(otp, record.hash, secret);
  if (isValid) {
    OTP_STORE.delete(phone);
  }
  return isValid;
}
