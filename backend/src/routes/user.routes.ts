import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getProfile,
  updateProfile,
  getUser,
  updateUser,
} from '../controllers/userController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.get('/', getUser);
router.put('/', updateUser);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
