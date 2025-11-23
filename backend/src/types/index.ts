export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  user_id: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  fitness_level?: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
  target_weight?: number;
  daily_calorie_goal?: number;
  daily_protein_goal?: number;
  daily_carbs_goal?: number;
  daily_fats_goal?: number;
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: string;
  muscle_group?: string;
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  instructions?: string[];
  image_url?: string;
  video_url?: string;
  created_at: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  name: string;
  date: string;
  duration?: number;
  calories_burned?: number;
  exercises: WorkoutExercise[];
  notes?: string;
  created_at: string;
}

export interface WorkoutExercise {
  exercise_id: string;
  sets: number;
  reps?: number;
  weight?: number;
  duration?: number;
  rest_time?: number;
}

export interface FoodItem {
  id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  serving_size?: string;
  serving_unit?: string;
}

export interface MealEntry {
  id: string;
  user_id: string;
  food_item: FoodItem;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servings: number;
  date: string;
  created_at: string;
}

export interface ProgressEntry {
  id: string;
  user_id: string;
  date: string;
  weight?: number;
  body_fat_percentage?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    legs?: number;
  };
  photos?: string[];
  notes?: string;
  created_at: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}
