import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getWorkoutSessions,
  getWorkoutSession,
  createWorkoutSession,
  updateWorkoutSession,
  deleteWorkoutSession,
  getWorkoutStats,
} from '../controllers/workoutController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Workout session routes
router.get('/', getWorkoutSessions);
router.get('/stats', getWorkoutStats);
router.get('/:id', getWorkoutSession);
router.post('/', createWorkoutSession);
router.put('/:id', updateWorkoutSession);
router.delete('/:id', deleteWorkoutSession);

export default router;
