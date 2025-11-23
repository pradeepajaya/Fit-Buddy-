import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { ProgressEntry } from '../types';

export const getProgressEntries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { start_date, end_date, limit } = req.query;

    let query = supabaseAdmin
      .from('progress_entries')
      .select('*')
      .eq('user_id', userId);

    if (start_date) query = query.gte('date', start_date);
    if (end_date) query = query.lte('date', end_date);
    if (limit) query = query.limit(Number(limit));

    const { data: entries, error } = await query.order('date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch progress entries' });
    }

    res.json({ entries });
  } catch (error: any) {
    console.error('Get progress entries error:', error);
    res.status(500).json({ error: 'Failed to fetch progress entries' });
  }
};

export const getProgressEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const { data: entry, error } = await supabaseAdmin
      .from('progress_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Progress entry not found' });
    }

    res.json({ entry });
  } catch (error: any) {
    console.error('Get progress entry error:', error);
    res.status(500).json({ error: 'Failed to fetch progress entry' });
  }
};

export const createProgressEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const entryData: Partial<ProgressEntry> = req.body;

    const { data: entry, error } = await supabaseAdmin
      .from('progress_entries')
      .insert([
        {
          ...entryData,
          user_id: userId,
          date: entryData.date || new Date().toISOString().split('T')[0],
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create progress entry' });
    }

    res.status(201).json({
      message: 'Progress entry created successfully',
      entry,
    });
  } catch (error: any) {
    console.error('Create progress entry error:', error);
    res.status(500).json({ error: 'Failed to create progress entry' });
  }
};

export const updateProgressEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const entryData = req.body;

    delete entryData.user_id;
    delete entryData.id;

    const { data: entry, error } = await supabaseAdmin
      .from('progress_entries')
      .update(entryData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update progress entry' });
    }

    res.json({
      message: 'Progress entry updated successfully',
      entry,
    });
  } catch (error: any) {
    console.error('Update progress entry error:', error);
    res.status(500).json({ error: 'Failed to update progress entry' });
  }
};

export const deleteProgressEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('progress_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete progress entry' });
    }

    res.json({ message: 'Progress entry deleted successfully' });
  } catch (error: any) {
    console.error('Delete progress entry error:', error);
    res.status(500).json({ error: 'Failed to delete progress entry' });
  }
};

export const getProgressStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { start_date, end_date } = req.query;

    let query = supabaseAdmin
      .from('progress_entries')
      .select('weight, body_fat_percentage, date')
      .eq('user_id', userId);

    if (start_date) query = query.gte('date', start_date);
    if (end_date) query = query.lte('date', end_date);

    const { data: entries, error } = await query.order('date', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch progress stats' });
    }

    const stats = {
      current_weight: null as number | null,
      starting_weight: null as number | null,
      weight_change: 0,
      current_body_fat: null as number | null,
      entries_count: entries?.length || 0,
    };

    if (entries && entries.length > 0) {
      stats.starting_weight = entries[0].weight;
      stats.current_weight = entries[entries.length - 1].weight;
      stats.current_body_fat = entries[entries.length - 1].body_fat_percentage;

      if (stats.starting_weight && stats.current_weight) {
        stats.weight_change = stats.current_weight - stats.starting_weight;
      }
    }

    res.json({ stats, entries });
  } catch (error: any) {
    console.error('Get progress stats error:', error);
    res.status(500).json({ error: 'Failed to fetch progress stats' });
  }
};
