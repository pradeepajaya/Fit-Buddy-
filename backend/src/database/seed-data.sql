-- Seed Data for Fit Buddy Wellness App
-- Run this after creating the schema

-- ============================================================================
-- EXERCISES DATA
-- ============================================================================

INSERT INTO exercises (id, name, description, category, muscle_group, equipment, difficulty, instructions, image_url) VALUES
-- Chest Exercises
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Push-ups', 'Classic bodyweight chest exercise', 'strength', 'chest', 'bodyweight', 'beginner', 
  ARRAY['Start in plank position with hands shoulder-width apart', 'Lower your body until chest nearly touches the floor', 'Push back up to starting position', 'Keep your core tight throughout'],
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b'),

('b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e', 'Bench Press', 'Compound chest exercise with barbell', 'strength', 'chest', 'barbell', 'intermediate',
  ARRAY['Lie on bench with feet flat on floor', 'Grip barbell slightly wider than shoulder-width', 'Lower bar to chest with control', 'Press bar back up until arms are extended'],
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'),

('c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f', 'Dumbbell Flyes', 'Isolation exercise for chest', 'strength', 'chest', 'dumbbells', 'intermediate',
  ARRAY['Lie on bench holding dumbbells above chest', 'Lower weights out to sides in wide arc', 'Feel stretch in chest', 'Bring weights back together over chest'],
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61'),

-- Back Exercises
('d4e5f6a7-b8c9-4d8e-1f2a-3b4c5d6e7f8a', 'Pull-ups', 'Upper body pulling exercise', 'strength', 'back', 'pull-up bar', 'advanced',
  ARRAY['Hang from bar with overhand grip', 'Pull yourself up until chin is over bar', 'Lower with control back to start', 'Keep core engaged'],
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e'),

('e5f6a7b8-c9d0-4e9f-2a3b-4c5d6e7f8a9b', 'Bent-Over Rows', 'Compound back exercise', 'strength', 'back', 'barbell', 'intermediate',
  ARRAY['Bend at hips with back straight', 'Hold barbell with overhand grip', 'Pull bar to lower chest', 'Lower with control'],
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e'),

('f6a7b8c9-d0e1-4f0a-3b4c-5d6e7f8a9b0c', 'Deadlift', 'Full body compound exercise', 'strength', 'back', 'barbell', 'advanced',
  ARRAY['Stand with feet hip-width apart', 'Grip barbell with hands outside knees', 'Keep back straight and lift by extending hips', 'Lower bar with control'],
  'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b'),

-- Leg Exercises
('a7b8c9d0-e1f2-4a1b-4c5d-6e7f8a9b0c1d', 'Squats', 'Compound leg exercise', 'strength', 'legs', 'barbell', 'intermediate',
  ARRAY['Stand with feet shoulder-width apart', 'Lower hips back and down', 'Keep chest up and knees tracking over toes', 'Push through heels to stand'],
  'https://images.unsplash.com/photo-1574680096145-d05b474e2155'),

('b8c9d0e1-f2a3-4b2c-5d6e-7f8a9b0c1d2e', 'Lunges', 'Single-leg strength exercise', 'strength', 'legs', 'bodyweight', 'beginner',
  ARRAY['Step forward with one leg', 'Lower hips until both knees are at 90 degrees', 'Push back to starting position', 'Alternate legs'],
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'),

('c9d0e1f2-a3b4-4c3d-6e7f-8a9b0c1d2e3f', 'Leg Press', 'Machine-based leg exercise', 'strength', 'legs', 'machine', 'beginner',
  ARRAY['Sit in machine with feet on platform', 'Lower weight by bending knees', 'Push platform back up', 'Keep back against pad'],
  'https://images.unsplash.com/photo-1434596922112-19c563067271'),

-- Shoulder Exercises
('d0e1f2a3-b4c5-4d4e-7f8a-9b0c1d2e3f4a', 'Shoulder Press', 'Overhead pressing movement', 'strength', 'shoulders', 'dumbbells', 'intermediate',
  ARRAY['Hold dumbbells at shoulder height', 'Press weights overhead', 'Lower with control back to shoulders', 'Keep core tight'],
  'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b'),

('e1f2a3b4-c5d6-4e5f-8a9b-0c1d2e3f4a5b', 'Lateral Raises', 'Shoulder isolation exercise', 'strength', 'shoulders', 'dumbbells', 'beginner',
  ARRAY['Stand with dumbbells at sides', 'Raise weights out to sides', 'Stop at shoulder height', 'Lower with control'],
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'),

-- Arm Exercises
('f2a3b4c5-d6e7-4f6a-9b0c-1d2e3f4a5b6c', 'Bicep Curls', 'Bicep isolation exercise', 'strength', 'arms', 'dumbbells', 'beginner',
  ARRAY['Stand with dumbbells at sides', 'Curl weights up to shoulders', 'Keep elbows stationary', 'Lower with control'],
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e'),

('a3b4c5d6-e7f8-4a7b-0c1d-2e3f4a5b6c7d', 'Tricep Dips', 'Tricep bodyweight exercise', 'strength', 'arms', 'bodyweight', 'intermediate',
  ARRAY['Position hands on parallel bars or bench', 'Lower body by bending elbows', 'Push back up to starting position', 'Keep elbows close to body'],
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e'),

-- Core Exercises
('b4c5d6e7-f8a9-4b8c-1d2e-3f4a5b6c7d8e', 'Plank', 'Core stability exercise', 'core', 'abs', 'bodyweight', 'beginner',
  ARRAY['Start in forearm plank position', 'Keep body in straight line', 'Engage core and hold', 'Breathe normally'],
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b'),

('c5d6e7f8-a9b0-4c9d-2e3f-4a5b6c7d8e9f', 'Crunches', 'Abdominal exercise', 'core', 'abs', 'bodyweight', 'beginner',
  ARRAY['Lie on back with knees bent', 'Place hands behind head', 'Lift shoulders off ground', 'Lower with control'],
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'),

('d6e7f8a9-b0c1-4d0e-3f4a-5b6c7d8e9f0a', 'Russian Twists', 'Oblique exercise', 'core', 'abs', 'bodyweight', 'intermediate',
  ARRAY['Sit with knees bent and feet off floor', 'Lean back slightly', 'Rotate torso side to side', 'Touch floor on each side'],
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e'),

-- Cardio Exercises
('e7f8a9b0-c1d2-4e1f-4a5b-6c7d8e9f0a1b', 'Running', 'Cardiovascular endurance exercise', 'cardio', 'full body', 'none', 'beginner',
  ARRAY['Start at comfortable pace', 'Land on midfoot', 'Keep arms at 90 degrees', 'Maintain steady breathing'],
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8'),

('f8a9b0c1-d2e3-4f2a-5b6c-7d8e9f0a1b2c', 'Jump Rope', 'High-intensity cardio', 'cardio', 'full body', 'jump rope', 'intermediate',
  ARRAY['Hold rope handles at hip level', 'Jump with both feet together', 'Rotate rope with wrists', 'Land softly on balls of feet'],
  'https://images.unsplash.com/photo-1518611012118-696072aa579a'),

('a9b0c1d2-e3f4-4a3b-6c7d-8e9f0a1b2c3d', 'Burpees', 'Full body conditioning', 'cardio', 'full body', 'bodyweight', 'advanced',
  ARRAY['Start standing', 'Drop to push-up position', 'Do a push-up', 'Jump feet to hands and jump up'],
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438'),

-- Flexibility/Mobility
('b0c1d2e3-f4a5-4b4c-7d8e-9f0a1b2c3d4e', 'Yoga Flow', 'Flexibility and mindfulness', 'flexibility', 'full body', 'yoga mat', 'beginner',
  ARRAY['Start in mountain pose', 'Flow through sun salutations', 'Hold each pose for 5 breaths', 'Focus on breath and form'],
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'),

('c1d2e3f4-a5b6-4c5d-8e9f-0a1b2c3d4e5f', 'Stretching Routine', 'Post-workout flexibility', 'flexibility', 'full body', 'none', 'beginner',
  ARRAY['Hold each stretch for 30 seconds', 'Breathe deeply and relax', 'Never bounce', 'Target all major muscle groups'],
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773');

-- ============================================================================
-- FOODS DATA (Common Foods)
-- ============================================================================

INSERT INTO foods (name, calories, protein, carbs, fats, serving_size, serving_unit) VALUES
-- Proteins
('Chicken Breast (Grilled)', 165, 31, 0, 3.6, 100, 'g'),
('Salmon (Cooked)', 206, 22, 0, 12, 100, 'g'),
('Tuna (Canned in Water)', 116, 26, 0, 1, 100, 'g'),
('Eggs (Large)', 155, 13, 1.1, 11, 2, 'eggs'),
('Greek Yogurt (Plain)', 59, 10, 3.6, 0.4, 100, 'g'),
('Whey Protein Powder', 120, 24, 3, 1.5, 30, 'g'),
('Tofu', 76, 8, 1.9, 4.8, 100, 'g'),
('Cottage Cheese', 98, 11, 3.4, 4.3, 100, 'g'),
('Ground Beef (Lean)', 250, 26, 0, 15, 100, 'g'),
('Turkey Breast', 135, 30, 0, 0.7, 100, 'g'),

-- Carbohydrates
('Brown Rice (Cooked)', 111, 2.6, 23, 0.9, 100, 'g'),
('Oatmeal (Cooked)', 71, 2.5, 12, 1.5, 100, 'g'),
('Whole Wheat Bread', 247, 13, 41, 3.4, 2, 'slices'),
('Sweet Potato (Baked)', 90, 2, 21, 0.2, 100, 'g'),
('Quinoa (Cooked)', 120, 4.4, 21, 1.9, 100, 'g'),
('Pasta (Whole Wheat)', 124, 5.3, 26, 0.5, 100, 'g'),
('White Rice (Cooked)', 130, 2.7, 28, 0.3, 100, 'g'),
('Banana', 89, 1.1, 23, 0.3, 1, 'medium'),
('Apple', 52, 0.3, 14, 0.2, 1, 'medium'),
('Blueberries', 57, 0.7, 14, 0.3, 100, 'g'),

-- Vegetables
('Broccoli', 34, 2.8, 7, 0.4, 100, 'g'),
('Spinach', 23, 2.9, 3.6, 0.4, 100, 'g'),
('Carrots', 41, 0.9, 10, 0.2, 100, 'g'),
('Bell Pepper', 20, 0.9, 4.6, 0.2, 100, 'g'),
('Tomato', 18, 0.9, 3.9, 0.2, 1, 'medium'),
('Cucumber', 16, 0.7, 3.6, 0.1, 100, 'g'),
('Lettuce', 15, 1.4, 2.9, 0.2, 100, 'g'),
('Avocado', 160, 2, 9, 15, 100, 'g'),
('Asparagus', 20, 2.2, 3.9, 0.1, 100, 'g'),
('Green Beans', 31, 1.8, 7, 0.2, 100, 'g'),

-- Healthy Fats
('Almonds', 579, 21, 22, 50, 100, 'g'),
('Peanut Butter', 588, 25, 20, 50, 100, 'g'),
('Olive Oil', 884, 0, 0, 100, 15, 'ml'),
('Walnuts', 654, 15, 14, 65, 100, 'g'),
('Cashews', 553, 18, 30, 44, 100, 'g'),
('Chia Seeds', 486, 17, 42, 31, 100, 'g'),
('Flaxseeds', 534, 18, 29, 42, 100, 'g'),

-- Dairy
('Milk (2%)', 50, 3.3, 4.8, 2, 100, 'ml'),
('Cheddar Cheese', 402, 25, 1.3, 33, 100, 'g'),
('Mozzarella Cheese', 280, 28, 3, 17, 100, 'g'),
('Butter', 717, 0.9, 0.1, 81, 100, 'g'),

-- Snacks
('Protein Bar', 200, 20, 22, 7, 1, 'bar'),
('Rice Cakes', 35, 0.7, 7.3, 0.3, 1, 'cake'),
('Dark Chocolate (70%)', 598, 8, 46, 43, 100, 'g'),
('Hummus', 166, 8, 14, 10, 100, 'g');

-- ============================================================================
-- SAMPLE USER (for testing - password is 'password123')
-- ============================================================================
-- Note: This will be created through the API registration endpoint
-- The password hash below is for 'password123'

COMMIT;

-- ============================================================================
-- Verify Data
-- ============================================================================
-- Run these queries to check your data:

-- SELECT COUNT(*) as exercise_count FROM exercises;
-- SELECT COUNT(*) as food_count FROM foods;
-- SELECT name, category, difficulty FROM exercises ORDER BY category, difficulty;
-- SELECT name, calories, protein FROM foods ORDER BY protein DESC LIMIT 10;
