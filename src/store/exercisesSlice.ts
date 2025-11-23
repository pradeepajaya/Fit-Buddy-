import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Exercise {
  id: string;
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
  duration?: number;
  calories?: number;
  description?: string;
}

interface ExercisesState {
  items: Exercise[];
  selectedExercise: Exercise | null;
  loading: boolean;
  error: string | null;
}

const initialState: ExercisesState = {
  items: [],
  selectedExercise: null,
  loading: false,
  error: null,
};

export const fetchExercises = createAsyncThunk(
  'exercises/fetchExercises',
  async () => {
    // Mock data for now
    const mockExercises: Exercise[] = [
      {
        id: '1',
        name: 'Jumping Jacks',
        type: 'cardio',
        muscle: 'full body',
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: 'Jump while spreading legs and raising arms.',
        duration: 10,
        calories: 50,
        description: 'A great cardio exercise to warm up and burn calories'
      },
      {
        id: '2',
        name: 'Burpees',
        type: 'cardio',
        muscle: 'full body',
        equipment: 'body_only',
        difficulty: 'intermediate',
        instructions: 'Squat, kick back to plank, push-up, jump up.',
        duration: 15,
        calories: 100,
        description: 'High-intensity full body exercise'
      },
      {
        id: '3',
        name: 'Push-ups',
        type: 'strength',
        muscle: 'chest',
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: 'Lower body until chest nearly touches floor, push back up.',
        duration: 10,
        calories: 40,
        description: 'Build upper body strength'
      },
      {
        id: '4',
        name: 'Squats',
        type: 'strength',
        muscle: 'quadriceps',
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: 'Lower body as if sitting, keep back straight.',
        duration: 10,
        calories: 45,
        description: 'Strengthen your legs and glutes'
      },
      {
        id: '5',
        name: 'Plank',
        type: 'strength',
        muscle: 'abdominals',
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: 'Hold body in straight line on forearms and toes.',
        duration: 5,
        calories: 30,
        description: 'Core strengthening exercise'
      },
      {
        id: '6',
        name: 'Crunches',
        type: 'strength',
        muscle: 'abdominals',
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: 'Lie on back, lift shoulders towards knees.',
        duration: 10,
        calories: 35,
        description: 'Target your abs'
      },
      {
        id: '7',
        name: 'Bicep Curls',
        type: 'strength',
        muscle: 'biceps',
        equipment: 'dumbbells',
        difficulty: 'beginner',
        instructions: 'Curl weights up to shoulders, lower slowly.',
        duration: 10,
        calories: 40,
        description: 'Build arm strength'
      },
      {
        id: '8',
        name: 'Lunges',
        type: 'strength',
        muscle: 'quadriceps',
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: 'Step forward and lower hips until both knees bent at 90°.',
        duration: 10,
        calories: 50,
        description: 'Great for legs and balance'
      },
      {
        id: '9',
        name: 'Yoga Flow',
        type: 'stretching',
        muscle: 'full body',
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: 'Move through a series of poses with breath.',
        duration: 20,
        calories: 60,
        description: 'Improve flexibility and reduce stress'
      },
      {
        id: '10',
        name: 'Mountain Climbers',
        type: 'cardio',
        muscle: 'full body',
        equipment: 'body_only',
        difficulty: 'intermediate',
        instructions: 'In plank position, alternate bringing knees to chest quickly.',
        duration: 10,
        calories: 80,
        description: 'High-intensity cardio and core workout'
      }
    ];
    
    return mockExercises;
  }
);

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setSelectedExercise: (state, action: PayloadAction<Exercise | null>) => {
      state.selectedExercise = action.payload;
    },
    clearSelectedExercise: (state) => {
      state.selectedExercise = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch exercises';
      });
  },
});

export const { setSelectedExercise, clearSelectedExercise } = exercisesSlice.actions;
export default exercisesSlice.reducer;
