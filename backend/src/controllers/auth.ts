import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
  AuthenticatedRequest,
} from '../types/auth';
import { prisma } from '../lib/prisma';
import { generateToken } from '../lib/jwt';
import { hashPassword, validateUser } from '../lib/auth';

export const me = async (
  req: AuthenticatedRequest,
  res: Response<{ user: User }>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Not authenticated');
    }

    // Fetch user from database to ensure they still exist
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<unknown, AuthResponse, LoginRequest>,
  res: Response<AuthResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate input
    validateUser({ username, password });

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      throw createHttpError(401, 'Invalid username or password');
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw createHttpError(401, 'Invalid username or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signup = async (
  req: Request<unknown, AuthResponse, SignupRequest>,
  res: Response<AuthResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate input
    validateUser({ username, password }, true);

    const normalizedUsername = username.toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: normalizedUsername },
    });

    if (existingUser) {
      throw createHttpError(409, 'Username already exists');
    }

    const hashedPassword = await hashPassword(password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    // Handle Prisma unique constraint errors
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      throw createHttpError(409, 'Username already exists');
    }
    next(error);
  }
};

// Controller to logout and clear cookie
export const logout = async (
  req: Request,
  res: Response<{ message: string }>,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
