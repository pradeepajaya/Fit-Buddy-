import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { WorkoutSession } from '../types';

export const getWorkoutSessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { start_date, end_date, limit } = req.query;

    let query = supabaseAdmin
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId);

    if (start_date) query = query.gte('date', start_date);
    if (end_date) query = query.lte('date', end_date);
    if (limit) query = query.limit(Number(limit));

    const { data: workouts, error } = await query.order('date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch workout sessions' });
    }

    res.json({ workouts });
  } catch (error: any) {
    console.error('Get workout sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch workout sessions' });
  }
};

export const getWorkoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const { data: workout, error } = await supabaseAdmin
      .from('workout_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Workout session not found' });
    }

    res.json({ workout });
  } catch (error: any) {
    console.error('Get workout session error:', error);
    res.status(500).json({ error: 'Failed to fetch workout session' });
  }
};

export const createWorkoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const workoutData: Partial<WorkoutSession> = req.body;

    const { data: workout, error } = await supabaseAdmin
      .from('workout_sessions')
      .insert([
        {
          ...workoutData,
          user_id: userId,
          date: workoutData.date || new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create workout session' });
    }

    res.status(201).json({
      message: 'Workout session created successfully',
      workout,
    });
  } catch (error: any) {
    console.error('Create workout session error:', error);
    res.status(500).json({ error: 'Failed to create workout session' });
  }
};

export const updateWorkoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const workoutData = req.body;

    delete workoutData.user_id;
    delete workoutData.id;

    const { data: workout, error } = await supabaseAdmin
      .from('workout_sessions')
      .update(workoutData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update workout session' });
    }

    res.json({
      message: 'Workout session updated successfully',
      workout,
    });
  } catch (error: any) {
    console.error('Update workout session error:', error);
    res.status(500).json({ error: 'Failed to update workout session' });
  }
};

export const deleteWorkoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('workout_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete workout session' });
    }

    res.json({ message: 'Workout session deleted successfully' });
  } catch (error: any) {
    console.error('Delete workout session error:', error);
    res.status(500).json({ error: 'Failed to delete workout session' });
  }
};

export const getWorkoutStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { start_date, end_date } = req.query;

    let query = supabaseAdmin
      .from('workout_sessions')
      .select('duration, calories_burned, date')
      .eq('user_id', userId);

    if (start_date) query = query.gte('date', start_date);
    if (end_date) query = query.lte('date', end_date);

    const { data: workouts, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch workout stats' });
    }

    const stats = {
      total_workouts: workouts?.length || 0,
      total_duration: 0,
      total_calories: 0,
      average_duration: 0,
      average_calories: 0,
    };

    workouts?.forEach((workout: any) => {
      stats.total_duration += workout.duration || 0;
      stats.total_calories += workout.calories_burned || 0;
    });

    if (stats.total_workouts > 0) {
      stats.average_duration = stats.total_duration / stats.total_workouts;
      stats.average_calories = stats.total_calories / stats.total_workouts;
    }

    res.json({ stats });
  } catch (error: any) {
    console.error('Get workout stats error:', error);
    res.status(500).json({ error: 'Failed to fetch workout stats' });
  }
};
