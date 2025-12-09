import { Request, Response } from 'express';

export const getHealth = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'OK' });
};
