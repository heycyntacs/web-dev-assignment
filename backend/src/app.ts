import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import { rootRoutes, authRoutes, notesRoutes } from './routes';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const allowedOrigins = [
        frontendUrl,
        'http://localhost',
        'http://localhost:80',
        'http://localhost:5173',
      ];

      // Normalize origin by removing default port (80 for http, 443 for https)
      const normalizeOrigin = (orig: string): string => {
        return orig.replace(/:(80|443)$/, '');
      };

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin matches any allowed origin (with or without port)
      const normalizedOrigin = normalizeOrigin(origin);
      const isAllowed = allowedOrigins.some(
        (allowed) =>
          allowed === origin || normalizeOrigin(allowed) === normalizedOrigin
      );

      if (isAllowed) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
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
