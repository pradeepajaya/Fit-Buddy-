import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getProgressEntries,
  getProgressEntry,
  createProgressEntry,
  updateProgressEntry,
  deleteProgressEntry,
  getProgressStats,
} from '../controllers/progressController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Progress entry routes
router.get('/', getProgressEntries);
router.get('/stats', getProgressStats);
router.get('/:id', getProgressEntry);
router.post('/', createProgressEntry);
router.put('/:id', updateProgressEntry);
router.delete('/:id', deleteProgressEntry);

export default router;
