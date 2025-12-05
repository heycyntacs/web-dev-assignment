import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

export const getHome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    res.json({ message: 'Welcome to Express w/ Typescript!' });
  } catch (err) {
    next(createError(500, 'Internal server error, try again'));
  }
};
