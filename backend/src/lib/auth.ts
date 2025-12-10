import createHttpError from 'http-errors';
import { LoginRequest, SignupRequest } from '../types/auth';
import bcrypt from 'bcrypt';
import { prisma } from './prisma';

export const validateUsername = (username: string) => {
  if (!username || typeof username !== 'string') {
    throw createHttpError(400, 'Username is required');
  }
  if (username.length < 2) {
    throw createHttpError(400, 'Username must be at least 2 characters long');
  }
  if (username.length > 50) {
    throw createHttpError(400, 'Username must be at most 50 characters long');
  }
};

export const validatePassword = (password: string, isSignup = false) => {
  if (!password || typeof password !== 'string') {
    throw createHttpError(400, 'Password is required');
  }
  if (isSignup && password.length < 8) {
    throw createHttpError(400, 'Password must be at least 8 characters long');
  }
};

export const validateUser = (
  user: LoginRequest | SignupRequest,
  isSignup = false
) => {
  validateUsername(user.username);
  validatePassword(user.password, isSignup);
};

export const verifyUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return user;
};

export const hashPassword = (password: string, saltRounds: number) => {
  return bcrypt.hash(password, saltRounds);
};
