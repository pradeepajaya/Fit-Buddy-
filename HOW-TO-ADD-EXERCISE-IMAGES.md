# How to Manually Add Exercise Images

This guide explains how to add images to exercises in the Fit Buddy Wellness App.

## Option 1: Using Local Images (Recommended for React Native)

### Step 1: Create an assets folder

```
src/
  assets/
    exercises/
      push-ups.jpg
      bench-press.jpg
      squats.jpg
      ... (other images)
```

### Step 2: Update the Exercise Interface

In `src/store/exercisesSlice.ts`, the Exercise interface already has `image_url` field:

```typescript
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
  image_url?: string; // ✅ Already added
}
```

### Step 3: Import Images in exercisesSlice.ts

At the top of `src/store/exercisesSlice.ts`:

```typescript
// Import local images
const exerciseImages = {
  pushups: require("../assets/exercises/push-ups.jpg"),
  benchpress: require("../assets/exercises/bench-press.jpg"),
  squats: require("../assets/exercises/squats.jpg"),
  pullups: require("../assets/exercises/pull-ups.jpg"),
  deadlift: require("../assets/exercises/deadlift.jpg"),
  // Add more...
};
```

### Step 4: Update Mock Exercise Data

In the `fetchExercises` function, replace the `image_url` with local images:

```typescript
{
  id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  name: 'Push-ups',
  type: 'strength',
  muscle: 'chest',
  muscle_group: 'chest',
  equipment: 'bodyweight',
  difficulty: 'beginner',
  instructions: '...',
  duration: 10,
  calories: 40,
  description: 'Classic bodyweight chest exercise',
  image_url: exerciseImages.pushups  // Use local image
}
```

### Step 5: Update ExerciseDetailScreen to Use Local Images

In `src/screens/ExerciseDetailScreen.tsx`, update the image rendering:

```typescript
// Replace the getExerciseGif function with direct image usage
<Image
  source={
    exercise.image_url
      ? exercise.image_url // Local image (already required)
      : {
          uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400",
        } // Fallback URL
  }
  style={styles.exerciseGif}
  resizeMode="cover"
/>
```

---

## Option 2: Using Online URLs (Current Implementation)

The app currently uses **Unsplash** image URLs. You can replace these with your own hosted images.

### Step 1: Host Images Online

Upload your exercise images to:

- **Cloudinary** (recommended, free tier available)
- **AWS S3**
- **Firebase Storage**
- **Imgur**
- Your own server

### Step 2: Update Image URLs in exercisesSlice.ts

In `src/store/exercisesSlice.ts`, update the `image_url` for each exercise:

```typescript
{
  id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  name: 'Push-ups',
  type: 'strength',
  muscle: 'chest',
  muscle_group: 'chest',
  equipment: 'bodyweight',
  difficulty: 'beginner',
  instructions: '...',
  duration: 10,
  calories: 40,
  description: 'Classic bodyweight chest exercise',
  image_url: 'https://your-cdn.com/images/push-ups.jpg'  // Your hosted image
}
```

### Step 3: Update ExerciseDetailScreen

In `src/screens/ExerciseDetailScreen.tsx`, the image is already rendered from URLs:

```typescript
<Image
  source={{ uri: getExerciseGif(exercise.name) }}
  style={styles.exerciseGif}
  resizeMode="cover"
/>
```

You can simplify this to use the image_url directly:

```typescript
<Image
  source={{
    uri:
      exercise.image_url ||
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400",
  }}
  style={styles.exerciseGif}
  resizeMode="cover"
/>
```

---

## Option 3: Using Exercise API (Backend Integration)

If you want to connect to your backend database:

### Step 1: Update fetchExercises in exercisesSlice.ts

Replace the mock data with an API call:

```typescript
export const fetchExercises = createAsyncThunk(
  "exercises/fetchExercises",
  async () => {
    const response = await fetch("http://your-backend-url/api/exercises");
    const data = await response.json();
    return data;
  }
);
```

### Step 2: Ensure Backend Returns image_url

Make sure your backend API returns exercises with the `image_url` field:

```json
{
  "id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
  "name": "Push-ups",
  "type": "strength",
  "muscle": "chest",
  "muscle_group": "chest",
  "equipment": "bodyweight",
  "difficulty": "beginner",
  "instructions": "...",
  "duration": 10,
  "calories": 40,
  "description": "Classic bodyweight chest exercise",
  "image_url": "https://your-cdn.com/images/push-ups.jpg"
}
```

---

## Image Specifications

### Recommended Image Dimensions:

- **Width**: 600-800px
- **Height**: 400-600px
- **Aspect Ratio**: 3:2 or 4:3
- **Format**: JPG (smaller file size) or PNG (better quality)
- **File Size**: Under 500KB per image

### Image Sources:

1. **Unsplash** - Free stock photos (current implementation)
2. **Pexels** - Free stock photos
3. **Custom Photography** - Take your own exercise photos
4. **Exercise.com** - Licensed exercise images (paid)
5. **Giphy** - For GIF animations (if you want animated exercises)

---

## Current Exercise List (22 exercises)

Here's the complete list of exercises that need images:

### Chest (3)

1. Push-ups
2. Bench Press
3. Dumbbell Flyes

### Back (3)

4. Pull-ups
5. Bent-Over Rows
6. Deadlift

### Legs (3)

7. Squats
8. Lunges
9. Leg Press

### Shoulders (2)

10. Shoulder Press
11. Lateral Raises

### Arms (2)

12. Bicep Curls
13. Tricep Dips

### Core (3)

14. Plank
15. Crunches
16. Russian Twists

### Cardio (3)

17. Running
18. Jump Rope
19. Burpees

### Flexibility (2)

20. Yoga Flow
21. Stretching Routine

---

## Quick Image Naming Convention

For local images, use this naming pattern:

```
push-ups.jpg
bench-press.jpg
dumbbell-flyes.jpg
pull-ups.jpg
bent-over-rows.jpg
deadlift.jpg
squats.jpg
lunges.jpg
leg-press.jpg
shoulder-press.jpg
lateral-raises.jpg
bicep-curls.jpg
tricep-dips.jpg
plank.jpg
crunches.jpg
russian-twists.jpg
running.jpg
jump-rope.jpg
burpees.jpg
yoga-flow.jpg
stretching-routine.jpg
```

---

## Testing

After adding images:

1. **Reload the app**: Press `r` in the Expo terminal or shake your device
2. **Check ExerciseDetailScreen**: Tap on any exercise to see the image
3. **Verify all categories**: Use "View All" button to check all exercises in each category
4. **Test dark mode**: Toggle dark mode to ensure images look good in both themes

---

## Troubleshooting

### Images not showing?

- Check image file paths are correct
- Verify image URLs are accessible
- Clear Metro bundler cache: `npx expo start --clear`
- Check console for image loading errors

### Images too slow to load?

- Reduce image file sizes (compress with TinyPNG)
- Use CDN for faster delivery
- Implement image caching

### Wrong images displayed?

- Check exercise name matches exactly (case-sensitive)
- Verify normalization logic in `getExerciseGif()`
- Update image mapping in both files

---

## Need Help?

If images still don't work:

1. Check the console for error messages
2. Verify image format is supported (JPG, PNG, WEBP)
3. Test with a simple URL first: `https://picsum.photos/600/400`
4. Ensure your device/emulator has internet connection (for URL images)
