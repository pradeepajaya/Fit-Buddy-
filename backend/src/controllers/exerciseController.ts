import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const getExercises = async (req: AuthRequest, res: Response) => {
  try {
    const { category, muscle_group, difficulty, search } = req.query;

    let query = supabaseAdmin.from('exercises').select('*');

    if (category) query = query.eq('category', category);
    if (muscle_group) query = query.eq('muscle_group', muscle_group);
    if (difficulty) query = query.eq('difficulty', difficulty);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data: exercises, error } = await query.order('name');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch exercises' });
    }

    res.json({ exercises });
  } catch (error: any) {
    console.error('Get exercises error:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
};

export const getExercise = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: exercise, error } = await supabaseAdmin
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json({ exercise });
  } catch (error: any) {
    console.error('Get exercise error:', error);
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
};

export const createExercise = async (req: AuthRequest, res: Response) => {
  try {
    const exerciseData = req.body;

    const { data: exercise, error } = await supabaseAdmin
      .from('exercises')
      .insert([exerciseData])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create exercise' });
    }

    res.status(201).json({
      message: 'Exercise created successfully',
      exercise,
    });
  } catch (error: any) {
    console.error('Create exercise error:', error);
    res.status(500).json({ error: 'Failed to create exercise' });
  }
};

export const getFavoriteExercises = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const { data: favorites, error } = await supabaseAdmin
      .from('favorite_exercises')
      .select(`
        exercise_id,
        exercises (*)
      `)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch favorites' });
    }

    const exercises = favorites?.map((fav: any) => fav.exercises) || [];

    res.json({ exercises });
  } catch (error: any) {
    console.error('Get favorite exercises error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

export const addFavoriteExercise = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { exercise_id } = req.body;

    const { data: favorite, error } = await supabaseAdmin
      .from('favorite_exercises')
      .insert([{ user_id: userId, exercise_id }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Exercise already in favorites' });
      }
      return res.status(500).json({ error: 'Failed to add favorite' });
    }

    res.status(201).json({
      message: 'Exercise added to favorites',
      favorite,
    });
  } catch (error: any) {
    console.error('Add favorite exercise error:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

export const removeFavoriteExercise = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('favorite_exercises')
      .delete()
      .eq('user_id', userId)
      .eq('exercise_id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to remove favorite' });
    }

    res.json({ message: 'Exercise removed from favorites' });
  } catch (error: any) {
    console.error('Remove favorite exercise error:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};
