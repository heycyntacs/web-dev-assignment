import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import { rootRoutes, authRoutes, notesRoutes } from './routes';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', rootRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, 'Page not found!'));
});

// error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  // Log error for debugging (in production, use proper logging)
  if (status >= 500) {
    console.error('Server error:', err);
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;
