import { Router } from 'express';
import { login, signup, me, logout } from '../controllers/auth';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/me', authenticateToken, me);

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', authenticateToken, logout);

export default router;
