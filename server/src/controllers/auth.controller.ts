import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client.js';
import { createOtp, validateOtp } from '../services/otp.service.js';
import { generateOtp } from '../utils/otp.js';
import { signJwt } from '../utils/jwt.js';

const phoneSchema = z.object({ phone: z.string().regex(/^\+?[1-9]\d{9,14}$/) });
const verifySchema = z.object({ phone: phoneSchema.shape.phone, otp: z.string().length(6) });

export async function requestOtp(req: Request, res: Response) {
  const { phone } = phoneSchema.parse(req.body);
  const otp = generateOtp();
  createOtp(phone, otp);
  // In production integrate with SMS provider; mock response ensures OTP is not logged to client.
  return res.json({ message: 'OTP sent successfully' });
}

export async function verifyOtp(req: Request, res: Response) {
  const { phone, otp } = verifySchema.parse(req.body);
  const isValid = validateOtp(phone, otp);
  if (!isValid) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone },
  });
  const token = signJwt({ sub: user.id, role: user.role, phone: user.phone });
  return res.json({ token, user: { id: user.id, role: user.role, phone: user.phone, name: user.name } });
}
