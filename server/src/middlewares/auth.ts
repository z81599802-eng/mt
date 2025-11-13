import type { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

export type Role = 'CUSTOMER' | 'ADMIN' | 'CASHIER' | 'OWNER';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: Role; phone: string };
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const token = authHeader.replace('Bearer ', '');
    const payload = verifyJwt(token);
    req.user = { id: payload.sub, role: payload.role as Role, phone: payload.phone };
    return next();
  } catch (error) {
    logger.warn('Failed authentication attempt', { error });
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function authorize(roles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    return next();
  };
}
