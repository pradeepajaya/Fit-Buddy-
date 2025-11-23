import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  searchFoods,
  getMealEntries,
  addMealEntry,
  deleteMealEntry,
  getNutritionSummary,
} from '../controllers/nutritionController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Food search
router.get('/foods/search', searchFoods);

// Meal entries
router.get('/meals', getMealEntries);
router.post('/meals', addMealEntry);
router.delete('/meals/:id', deleteMealEntry);

// Nutrition summary
router.get('/summary', getNutritionSummary);

export default router;
