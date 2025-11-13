import crypto from 'crypto';

export function generateOtp(): string {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

export function hashOtp(otp: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(otp).digest('hex');
}

export function verifyOtp(otp: string, hash: string, secret: string): boolean {
  const candidate = hashOtp(otp, secret);
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}
