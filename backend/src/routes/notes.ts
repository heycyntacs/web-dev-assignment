import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
} from '../controllers/notes';

const router = Router();

router.get('/', authenticateToken, getNotes);
router.get('/:id', authenticateToken, getNote);

router.post('/', authenticateToken, createNote);

router.put('/:id', authenticateToken, updateNote);

router.delete('/:id', authenticateToken, deleteNote);

export default router;
