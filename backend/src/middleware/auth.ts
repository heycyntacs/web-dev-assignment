import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import createHttpError from 'http-errors';
import { verifyToken } from '../lib/jwt';

// Middleware to verify JWT token
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookie
    const token = req.cookies?.auth_token;

    if (!token) {
      throw createHttpError(401, 'No token provided');
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Invalid or expired token'
    ) {
      next(createHttpError(401, 'Invalid or expired token'));
    } else {
      next(error);
    }
  }
};
