# Firebase Storage Guide: Exercise Images

This guide explains how to store exercise images in Firebase Storage and retrieve them in your Fit Buddy mobile app.

## 📋 Table of Contents

1. [Setup Firebase Project](#setup-firebase-project)
2. [Install Firebase SDK](#install-firebase-sdk)
3. [Configure Firebase in Your App](#configure-firebase-in-your-app)
4. [Upload Images to Firebase Storage](#upload-images-to-firebase-storage)
5. [Retrieve Images in Your App](#retrieve-images-in-your-app)
6. [Update Exercise Data with Image URLs](#update-exercise-data-with-image-urls)

---

## 1. Setup Firebase Project

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `fit-buddy-wellness`
4. Enable/disable Google Analytics (your choice)
5. Click **"Create project"**

### Step 2: Register Your App

1. In your Firebase project dashboard, click the **Android** or **iOS** icon
2. Register your app with package name (e.g., `com.fitbuddy.app`)
3. Download `google-services.json` (Android) or `GoogleService-Info.plist` (iOS)
4. Follow the setup instructions

### Step 3: Enable Firebase Storage

1. In Firebase Console, go to **Storage** in left sidebar
2. Click **"Get Started"**
3. Choose production mode or test mode
4. Select a storage location (e.g., `us-central1`)
5. Click **"Done"**

### Step 4: Set Storage Rules (for testing)

In Firebase Console → Storage → Rules, add:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /exercises/{imageId} {
      // Allow anyone to read exercise images
      allow read: if true;
      // Allow authenticated users to upload
      allow write: if request.auth != null;
    }
  }
}
```

---

## 2. Install Firebase SDK

### For Expo (React Native)

```powershell
cd "f:\Fit Buddy Wellness App"
npx expo install firebase
```

### Verify Installation

Check `package.json` for:

```json
{
  "dependencies": {
    "firebase": "^10.x.x"
  }
}
```

---

## 3. Configure Firebase in Your App

### Step 1: Create Firebase Config File

Create `src/config/firebase.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Find this in Firebase Console → Project Settings → General
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "fit-buddy-wellness.firebaseapp.com",
  projectId: "fit-buddy-wellness",
  storageBucket: "fit-buddy-wellness.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);
```

### Step 2: Get Your Firebase Config

1. Go to Firebase Console
2. Click gear icon → **Project Settings**
3. Scroll to **"Your apps"** section
4. Copy the `firebaseConfig` object
5. Replace values in `src/config/firebase.ts`

---

## 4. Upload Images to Firebase Storage

You have **two options** for uploading images:

### Option A: Upload via Firebase Console (Easiest)

1. **Prepare Your Images**

   - Name images clearly (e.g., `push-ups.jpg`, `squats.jpg`, `bench-press.jpg`)
   - Recommended size: 400x300px (matches current image URLs)
   - Format: JPG or PNG

2. **Upload to Firebase Console**

   - Go to Firebase Console → Storage
   - Click **"Upload file"** or drag & drop
   - Create folder structure: `exercises/`
   - Upload all exercise images to `exercises/` folder

3. **Get Image URLs**
   - Click on uploaded image
   - Copy the **Download URL** (looks like: `https://firebasestorage.googleapis.com/v0/b/...`)
   - Save these URLs for later

**Exercise Image Names (22 total):**

```
chest/
  - push-ups.jpg
  - bench-press.jpg
  - dumbbell-flyes.jpg

back/
  - pull-ups.jpg
  - bent-over-rows.jpg
  - deadlift.jpg

legs/
  - squats.jpg
  - lunges.jpg
  - leg-press.jpg

shoulders/
  - shoulder-press.jpg
  - lateral-raises.jpg

arms/
  - bicep-curls.jpg
  - tricep-dips.jpg

abs/
  - plank.jpg
  - crunches.jpg
  - russian-twists.jpg

cardio/
  - running.jpg
  - jump-rope.jpg
  - burpees.jpg

flexibility/
  - yoga-flow.jpg
  - stretching-routine.jpg
```

### Option B: Upload Programmatically (Advanced)

Create `src/utils/uploadExerciseImages.ts`:

```typescript
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

export async function uploadExerciseImage(
  exerciseName: string,
  imageUri: string
): Promise<string> {
  try {
    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Create storage reference
    const fileName = `${exerciseName.toLowerCase().replace(/\s+/g, "-")}.jpg`;
    const storageRef = ref(storage, `exercises/${fileName}`);

    // Upload image
    await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    console.log("Image uploaded:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

// Usage example:
export async function pickAndUploadImage(exerciseName: string) {
  // Request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    alert("Permission denied!");
    return;
  }

  // Pick image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (!result.canceled) {
    const imageUrl = await uploadExerciseImage(
      exerciseName,
      result.assets[0].uri
    );
    return imageUrl;
  }
}
```

---

## 5. Retrieve Images in Your App

### Method 1: Direct URLs in Exercise Data

Update `src/store/exercisesSlice.ts`:

```typescript
const exercisesWithFirebaseImages = [
  {
    id: "1",
    name: "Push-ups",
    muscle_group: "chest",
    difficulty: "beginner",
    duration: 15,
    calories: 120,
    description: "Classic bodyweight exercise",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/fit-buddy-wellness.appspot.com/o/exercises%2Fpush-ups.jpg?alt=media",
  },
  {
    id: "2",
    name: "Squats",
    muscle_group: "legs",
    difficulty: "beginner",
    duration: 20,
    calories: 150,
    description: "Lower body strength exercise",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/fit-buddy-wellness.appspot.com/o/exercises%2Fsquats.jpg?alt=media",
  },
  // ... add all 22 exercises
];
```

### Method 2: Dynamic URL Retrieval

Create `src/utils/getExerciseImage.ts`:

```typescript
import { storage } from "../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";

export async function getExerciseImageUrl(
  exerciseName: string
): Promise<string> {
  try {
    const fileName = exerciseName.toLowerCase().replace(/\s+/g, "-");
    const imageRef = ref(storage, `exercises/${fileName}.jpg`);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error("Error getting image URL:", error);
    // Return fallback image
    return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop";
  }
}

// Usage in ExerciseDetailScreen:
const [imageUrl, setImageUrl] = useState("");

useEffect(() => {
  getExerciseImageUrl(exercise.name).then(setImageUrl);
}, [exercise.name]);
```

### Method 3: Cached URLs with AsyncStorage

Create `src/utils/imageCache.ts`:

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getExerciseImageUrl } from "./getExerciseImage";

const IMAGE_CACHE_KEY = "exerciseImageCache";

export async function getCachedImageUrl(exerciseName: string): Promise<string> {
  try {
    // Check cache first
    const cacheStr = await AsyncStorage.getItem(IMAGE_CACHE_KEY);
    const cache = cacheStr ? JSON.parse(cacheStr) : {};

    if (cache[exerciseName]) {
      return cache[exerciseName];
    }

    // Fetch from Firebase
    const url = await getExerciseImageUrl(exerciseName);

    // Cache it
    cache[exerciseName] = url;
    await AsyncStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));

    return url;
  } catch (error) {
    console.error("Cache error:", error);
    return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop";
  }
}
```

---

## 6. Update Exercise Data with Image URLs

### Update ExerciseDetailScreen to Use Firebase Images

Modify `src/screens/ExerciseDetailScreen.tsx`:

```typescript
import { getCachedImageUrl } from "../utils/imageCache";

// Inside component:
const [exerciseImageUrl, setExerciseImageUrl] = useState("");
const [imageLoading, setImageLoading] = useState(true);

useEffect(() => {
  loadExerciseImage();
}, [exercise]);

const loadExerciseImage = async () => {
  setImageLoading(true);
  try {
    const url = await getCachedImageUrl(exercise.name);
    setExerciseImageUrl(url);
  } catch (error) {
    console.error("Image load error:", error);
  } finally {
    setImageLoading(false);
  }
};

// In JSX:
<Image
  source={{ uri: exerciseImageUrl }}
  style={styles.exerciseImage}
  onLoadStart={() => setImageLoading(true)}
  onLoadEnd={() => setImageLoading(false)}
/>;
{
  imageLoading && <ActivityIndicator />;
}
```

---

## 📝 Quick Setup Checklist

- [ ] Create Firebase project
- [ ] Enable Firebase Storage
- [ ] Download and add config files
- [ ] Install Firebase SDK (`npx expo install firebase`)
- [ ] Create `src/config/firebase.ts` with your config
- [ ] Prepare 22 exercise images (400x300px)
- [ ] Upload images to Firebase Storage Console
- [ ] Copy download URLs for each image
- [ ] Update `exercisesSlice.ts` with Firebase URLs
- [ ] Test image loading in app
- [ ] Implement caching for better performance

---

## 🎯 Image Naming Convention

**Format:** `muscle-group/exercise-name.jpg`

**Examples:**

```
exercises/
  chest/push-ups.jpg
  chest/bench-press.jpg
  legs/squats.jpg
  back/pull-ups.jpg
  cardio/running.jpg
```

**Or flat structure:**

```
exercises/
  push-ups.jpg
  squats.jpg
  pull-ups.jpg
  running.jpg
```

---

## 🔒 Security Best Practices

1. **Production Rules** (After testing):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /exercises/{imageId} {
      allow read: if true;  // Public read
      allow write: if request.auth != null &&
                      request.auth.token.admin == true;  // Admin only write
    }
  }
}
```

2. **Optimize Images**:

   - Use compressed JPG format
   - Max size: 400x300px
   - Quality: 80%
   - Use CDN for better performance

3. **Error Handling**:
   - Always provide fallback images
   - Cache URLs to reduce API calls
   - Handle offline scenarios

---

## 📚 Resources

- [Firebase Storage Docs](https://firebase.google.com/docs/storage)
- [Expo Firebase Integration](https://docs.expo.dev/guides/using-firebase/)
- [Firebase Console](https://console.firebase.google.com/)
- [Image Optimization Guide](https://developers.google.com/speed/docs/insights/OptimizeImages)

---

## 🆘 Troubleshooting

**Problem:** Can't see uploaded images

- Check Storage Rules allow read access
- Verify file paths match exactly
- Check Firebase Console → Storage for files

**Problem:** CORS errors

- Go to Storage → Rules → Update CORS settings
- Add your app domain to allowed origins

**Problem:** Images load slowly

- Implement caching with AsyncStorage
- Reduce image file sizes
- Use CDN or Firebase CDN

---

## 💡 Next Steps

1. Upload all 22 exercise images to Firebase
2. Get download URLs for each image
3. Update `exercisesSlice.ts` with real URLs
4. Implement image caching
5. Add loading states for better UX
6. Test on both iOS and Android

Good luck! 🚀
