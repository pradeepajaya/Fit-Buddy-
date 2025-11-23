import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import axios from 'axios';

export const searchFoods = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // If Nutritionix API is configured, use it
    if (process.env.NUTRITIONIX_APP_ID && process.env.NUTRITIONIX_API_KEY) {
      const response = await axios.post(
        'https://trackapi.nutritionix.com/v2/natural/nutrients',
        { query },
        {
          headers: {
            'x-app-id': process.env.NUTRITIONIX_APP_ID,
            'x-app-key': process.env.NUTRITIONIX_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const foods = response.data.foods.map((food: any) => ({
        name: food.food_name,
        calories: food.nf_calories,
        protein: food.nf_protein,
        carbs: food.nf_total_carbohydrate,
        fats: food.nf_total_fat,
        serving_size: food.serving_qty,
        serving_unit: food.serving_unit,
      }));

      return res.json({ foods });
    }

    // Otherwise, search from database
    const { data: foods, error } = await supabaseAdmin
      .from('foods')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(20);

    if (error) {
      return res.status(500).json({ error: 'Failed to search foods' });
    }

    res.json({ foods: foods || [] });
  } catch (error: any) {
    console.error('Search foods error:', error);
    res.status(500).json({ error: 'Failed to search foods' });
  }
};

export const getMealEntries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { date, start_date, end_date } = req.query;

    let query = supabaseAdmin
      .from('meal_entries')
      .select('*')
      .eq('user_id', userId);

    if (date) {
      query = query.eq('date', date);
    } else if (start_date && end_date) {
      query = query.gte('date', start_date).lte('date', end_date);
    }

    const { data: meals, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch meal entries' });
    }

    res.json({ meals });
  } catch (error: any) {
    console.error('Get meal entries error:', error);
    res.status(500).json({ error: 'Failed to fetch meal entries' });
  }
};

export const addMealEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { food_item, meal_type, servings, date } = req.body;

    const { data: meal, error } = await supabaseAdmin
      .from('meal_entries')
      .insert([
        {
          user_id: userId,
          food_item,
          meal_type,
          servings: servings || 1,
          date: date || new Date().toISOString().split('T')[0],
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to add meal entry' });
    }

    res.status(201).json({
      message: 'Meal entry added successfully',
      meal,
    });
  } catch (error: any) {
    console.error('Add meal entry error:', error);
    res.status(500).json({ error: 'Failed to add meal entry' });
  }
};

export const deleteMealEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('meal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete meal entry' });
    }

    res.json({ message: 'Meal entry deleted successfully' });
  } catch (error: any) {
    console.error('Delete meal entry error:', error);
    res.status(500).json({ error: 'Failed to delete meal entry' });
  }
};

export const getNutritionSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { date } = req.query;

    const targetDate = date || new Date().toISOString().split('T')[0];

    const { data: meals, error } = await supabaseAdmin
      .from('meal_entries')
      .select('food_item, servings')
      .eq('user_id', userId)
      .eq('date', targetDate);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch nutrition summary' });
    }

    const summary = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    };

    meals?.forEach((meal: any) => {
      const { food_item, servings } = meal;
      summary.calories += (food_item.calories || 0) * servings;
      summary.protein += (food_item.protein || 0) * servings;
      summary.carbs += (food_item.carbs || 0) * servings;
      summary.fats += (food_item.fats || 0) * servings;
    });

    res.json({ summary, date: targetDate });
  } catch (error: any) {
    console.error('Get nutrition summary error:', error);
    res.status(500).json({ error: 'Failed to fetch nutrition summary' });
  }
};
