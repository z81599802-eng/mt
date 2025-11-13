import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  return res.status(500).json({ message: 'Internal server error' });
}
