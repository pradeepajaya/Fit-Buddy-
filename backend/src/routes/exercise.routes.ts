import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getExercises,
  getExercise,
  createExercise,
  getFavoriteExercises,
  addFavoriteExercise,
  removeFavoriteExercise,
} from '../controllers/exerciseController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Exercise routes
router.get('/', getExercises);
router.get('/:id', getExercise);
router.post('/', createExercise);

// Favorite exercise routes
router.get('/favorites/list', getFavoriteExercises);
router.post('/favorites', addFavoriteExercise);
router.delete('/favorites/:id', removeFavoriteExercise);

export default router;
