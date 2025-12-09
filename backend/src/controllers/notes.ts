import { Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../types/auth';
import { verifyUser } from '../lib/auth';

export const getNotes = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Not authenticated');
    }

    await verifyUser(req.user.userId);

    // Find notes for the authenticated user
    const notes = await prisma.note.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Not authenticated');
    }

    await verifyUser(req.user.userId);

    // Find note for the authenticated user
    const note = await prisma.note.findUnique({
      where: { id: req.params.id },
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Not authenticated');
    }

    await verifyUser(req.user.userId);

    // Create note for the authenticated user
    const note = await prisma.note.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        userId: req.user.userId,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Not authenticated');
    }

    await verifyUser(req.user.userId);

    // Update note for the authenticated user
    const note = await prisma.note.update({
      where: { id: req.params.id, userId: req.user.userId },
      data: {
        title: req.body.title,
        content: req.body.content,
        updatedAt: new Date(),
      },
    });

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Not authenticated');
    }

    await verifyUser(req.user.userId);

    // Delete note for the authenticated user
    await prisma.note.delete({
      where: { id: req.params.id, userId: req.user.userId },
    });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};
