import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Exercise {
  id: string;
  name: string;
  type: string;
  muscle: string;
  muscle_group?: string;
  equipment: string;
  difficulty: string;
  instructions: string;
  duration?: number;
  calories?: number;
  description?: string;
  image_url?: string;
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
    // Mock data matching the database structure
    const mockExercises: Exercise[] = [
      // Chest Exercises
      {
        id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
        name: 'Push-ups',
        type: 'strength',
        muscle: 'chest',
        muscle_group: 'chest',
        equipment: 'bodyweight',
        difficulty: 'beginner',
        instructions: 'Start in plank position with hands shoulder-width apart. Lower your body until chest nearly touches the floor. Push back up to starting position. Keep your core tight throughout.',
        duration: 10,
        calories: 40,
        description: 'Classic bodyweight chest exercise',
        image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b'
      },
      {
        id: 'b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e',
        name: 'Bench Press',
        type: 'strength',
        muscle: 'chest',
        muscle_group: 'chest',
        equipment: 'barbell',
        difficulty: 'intermediate',
        instructions: 'Lie on bench with feet flat on floor. Grip barbell slightly wider than shoulder-width. Lower bar to chest with control. Press bar back up until arms are extended.',
        duration: 15,
        calories: 80,
        description: 'Compound chest exercise with barbell',
        image_url: 'https://images.unsplash.com/photo-1588492069485-d05b56b2831d'
      },
      {
        id: 'c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f',
        name: 'Dumbbell Flyes',
        type: 'strength',
        muscle: 'chest',
        muscle_group: 'chest',
        equipment: 'dumbbells',
        difficulty: 'intermediate',
        instructions: 'Lie on bench holding dumbbells above chest. Lower weights out to sides in wide arc. Feel stretch in chest. Bring weights back together over chest.',
        duration: 12,
        calories: 60,
        description: 'Isolation exercise for chest',
        image_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f'
      },
      // Back Exercises
      {
        id: 'd4e5f6a7-b8c9-4d8e-1f2a-3b4c5d6e7f8a',
        name: 'Pull-ups',
        type: 'strength',
        muscle: 'back',
        muscle_group: 'back',
        equipment: 'pull-up bar',
        difficulty: 'advanced',
        instructions: 'Hang from bar with overhand grip. Pull yourself up until chin is over bar. Lower with control back to start. Keep core engaged.',
        duration: 10,
        calories: 70,
        description: 'Upper body pulling exercise',
        image_url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00'
      },
      {
        id: 'e5f6a7b8-c9d0-4e9f-2a3b-4c5d6e7f8a9b',
        name: 'Bent-Over Rows',
        type: 'strength',
        muscle: 'back',
        muscle_group: 'back',
        equipment: 'barbell',
        difficulty: 'intermediate',
        instructions: 'Bend at hips with back straight. Hold barbell with overhand grip. Pull bar to lower chest. Lower with control.',
        duration: 12,
        calories: 65,
        description: 'Compound back exercise',
        image_url: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3'
      },
      {
        id: 'f6a7b8c9-d0e1-4f0a-3b4c-5d6e7f8a9b0c',
        name: 'Deadlift',
        type: 'strength',
        muscle: 'back',
        muscle_group: 'back',
        equipment: 'barbell',
        difficulty: 'advanced',
        instructions: 'Stand with feet hip-width apart. Grip barbell with hands outside knees. Keep back straight and lift by extending hips. Lower bar with control.',
        duration: 15,
        calories: 100,
        description: 'Full body compound exercise',
        image_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b'
      },
      // Leg Exercises
      {
        id: 'a7b8c9d0-e1f2-4a1b-4c5d-6e7f8a9b0c1d',
        name: 'Squats',
        type: 'strength',
        muscle: 'quadriceps',
        muscle_group: 'legs',
        equipment: 'barbell',
        difficulty: 'intermediate',
        instructions: 'Stand with feet shoulder-width apart. Lower hips back and down. Keep chest up and knees tracking over toes. Push through heels to stand.',
        duration: 12,
        calories: 70,
        description: 'Compound leg exercise',
        image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155'
      },
      {
        id: 'b8c9d0e1-f2a3-4b2c-5d6e-7f8a9b0c1d2e',
        name: 'Lunges',
        type: 'strength',
        muscle: 'quadriceps',
        muscle_group: 'legs',
        equipment: 'bodyweight',
        difficulty: 'beginner',
        instructions: 'Step forward with one leg. Lower hips until both knees are at 90 degrees. Push back to starting position. Alternate legs.',
        duration: 10,
        calories: 50,
        description: 'Single-leg strength exercise',
        image_url: 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0'
      },
      {
        id: 'c9d0e1f2-a3b4-4c3d-6e7f-8a9b0c1d2e3f',
        name: 'Leg Press',
        type: 'strength',
        muscle: 'quadriceps',
        muscle_group: 'legs',
        equipment: 'machine',
        difficulty: 'beginner',
        instructions: 'Sit in machine with feet on platform. Lower weight by bending knees. Push platform back up. Keep back against pad.',
        duration: 12,
        calories: 60,
        description: 'Machine-based leg exercise',
        image_url: 'https://images.unsplash.com/photo-1434596922112-19c563067271'
      },
      // Shoulder Exercises
      {
        id: 'd0e1f2a3-b4c5-4d4e-7f8a-9b0c1d2e3f4a',
        name: 'Shoulder Press',
        type: 'strength',
        muscle: 'shoulders',
        muscle_group: 'shoulders',
        equipment: 'dumbbells',
        difficulty: 'intermediate',
        instructions: 'Hold dumbbells at shoulder height. Press weights overhead. Lower with control back to shoulders. Keep core tight.',
        duration: 12,
        calories: 65,
        description: 'Overhead pressing movement',
        image_url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5'
      },
      {
        id: 'e1f2a3b4-c5d6-4e5f-8a9b-0c1d2e3f4a5b',
        name: 'Lateral Raises',
        type: 'strength',
        muscle: 'shoulders',
        muscle_group: 'shoulders',
        equipment: 'dumbbells',
        difficulty: 'beginner',
        instructions: 'Stand with dumbbells at sides. Raise weights out to sides. Stop at shoulder height. Lower with control.',
        duration: 10,
        calories: 45,
        description: 'Shoulder isolation exercise',
        image_url: 'https://images.unsplash.com/photo-1584380931214-dbb0bc1fcbad'
      },
      // Arm Exercises
      {
        id: 'f2a3b4c5-d6e7-4f6a-9b0c-1d2e3f4a5b6c',
        name: 'Bicep Curls',
        type: 'strength',
        muscle: 'biceps',
        muscle_group: 'arms',
        equipment: 'dumbbells',
        difficulty: 'beginner',
        instructions: 'Stand with dumbbells at sides. Curl weights up to shoulders. Keep elbows stationary. Lower with control.',
        duration: 10,
        calories: 40,
        description: 'Bicep isolation exercise',
        image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e'
      },
      {
        id: 'a3b4c5d6-e7f8-4a7b-0c1d-2e3f4a5b6c7d',
        name: 'Tricep Dips',
        type: 'strength',
        muscle: 'triceps',
        muscle_group: 'arms',
        equipment: 'bodyweight',
        difficulty: 'intermediate',
        instructions: 'Position hands on parallel bars or bench. Lower body by bending elbows. Push back up to starting position. Keep elbows close to body.',
        duration: 10,
        calories: 50,
        description: 'Tricep bodyweight exercise',
        image_url: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1'
      },
      // Core Exercises
      {
        id: 'b4c5d6e7-f8a9-4b8c-1d2e-3f4a5b6c7d8e',
        name: 'Plank',
        type: 'core',
        muscle: 'abdominals',
        muscle_group: 'abs',
        equipment: 'bodyweight',
        difficulty: 'beginner',
        instructions: 'Start in forearm plank position. Keep body in straight line. Engage core and hold. Breathe normally.',
        duration: 5,
        calories: 30,
        description: 'Core stability exercise',
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
      },
      {
        id: 'c5d6e7f8-a9b0-4c9d-2e3f-4a5b6c7d8e9f',
        name: 'Crunches',
        type: 'core',
        muscle: 'abdominals',
        muscle_group: 'abs',
        equipment: 'bodyweight',
        difficulty: 'beginner',
        instructions: 'Lie on back with knees bent. Place hands behind head. Lift shoulders off ground. Lower with control.',
        duration: 10,
        calories: 35,
        description: 'Abdominal exercise',
        image_url: 'https://images.unsplash.com/photo-1539794830467-1f1755804d13'
      },
      {
        id: 'd6e7f8a9-b0c1-4d0e-3f4a-5b6c7d8e9f0a',
        name: 'Russian Twists',
        type: 'core',
        muscle: 'obliques',
        muscle_group: 'abs',
        equipment: 'bodyweight',
        difficulty: 'intermediate',
        instructions: 'Sit with knees bent and feet off floor. Lean back slightly. Rotate torso side to side. Touch floor on each side.',
        duration: 10,
        calories: 45,
        description: 'Oblique exercise',
        image_url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0'
      },
      // Cardio Exercises
      {
        id: 'e7f8a9b0-c1d2-4e1f-4a5b-6c7d8e9f0a1b',
        name: 'Running',
        type: 'cardio',
        muscle: 'full body',
        muscle_group: 'full body',
        equipment: 'none',
        difficulty: 'beginner',
        instructions: 'Start at comfortable pace. Land on midfoot. Keep arms at 90 degrees. Maintain steady breathing.',
        duration: 20,
        calories: 150,
        description: 'Cardiovascular endurance exercise',
        image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8'
      },
      {
        id: 'f8a9b0c1-d2e3-4f2a-5b6c-7d8e9f0a1b2c',
        name: 'Jump Rope',
        type: 'cardio',
        muscle: 'full body',
        muscle_group: 'full body',
        equipment: 'jump rope',
        difficulty: 'intermediate',
        instructions: 'Hold rope handles at hip level. Jump with both feet together. Rotate rope with wrists. Land softly on balls of feet.',
        duration: 15,
        calories: 120,
        description: 'High-intensity cardio',
        image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a'
      },
      {
        id: 'a9b0c1d2-e3f4-4a3b-6c7d-8e9f0a1b2c3d',
        name: 'Burpees',
        type: 'cardio',
        muscle: 'full body',
        muscle_group: 'full body',
        equipment: 'bodyweight',
        difficulty: 'advanced',
        instructions: 'Start standing. Drop to push-up position. Do a push-up. Jump feet to hands and jump up.',
        duration: 15,
        calories: 100,
        description: 'Full body conditioning',
        image_url: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3'
      },
      // Flexibility/Mobility
      {
        id: 'b0c1d2e3-f4a5-4b4c-7d8e-9f0a1b2c3d4e',
        name: 'Yoga Flow',
        type: 'flexibility',
        muscle: 'full body',
        muscle_group: 'full body',
        equipment: 'yoga mat',
        difficulty: 'beginner',
        instructions: 'Start in mountain pose. Flow through sun salutations. Hold each pose for 5 breaths. Focus on breath and form.',
        duration: 20,
        calories: 60,
        description: 'Flexibility and mindfulness',
        image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'
      },
      {
        id: 'c1d2e3f4-a5b6-4c5d-8e9f-0a1b2c3d4e5f',
        name: 'Stretching Routine',
        type: 'flexibility',
        muscle: 'full body',
        muscle_group: 'full body',
        equipment: 'none',
        difficulty: 'beginner',
        instructions: 'Hold each stretch for 30 seconds. Breathe deeply and relax. Never bounce. Target all major muscle groups.',
        duration: 15,
        calories: 40,
        description: 'Post-workout flexibility',
        image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773'
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
