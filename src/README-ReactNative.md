# Fit Buddy - React Native App

A comprehensive fitness tracking mobile application built with React Native, featuring exercise logging with photos, water intake tracking, wellness tips, progress analytics, smart notifications, and **beautiful Light/Dark theme switching**.

## ✨ New Features (v2.0)

### 🎨 Theme Switching
- **Light Mode**: Clean, bright interface for daytime use
- **Dark Mode**: Eye-friendly dark theme for low-light conditions
- **System Default**: Automatically matches device theme
- Theme preference saved and persists across app restarts

### ⚙️ Unified Settings
- Settings integrated into Profile page for better usability
- Toggle switches for all notification preferences
- Centralized control for app behavior
- No separate Settings tab - everything in one place!

### 🎯 Enhanced User Experience
- More intuitive navigation with 6 main tabs
- Beautiful gradient cards throughout
- Smooth animations and transitions
- Theme-aware components that adapt automatically
- Better visual hierarchy and readability

## Features

### 🏠 Home Screen
- Personalized dashboard with daily greeting
- Daily wellness tips in gradient cards
- Quick stats for water intake and exercise with progress bars
- 4 quick action buttons for common tasks
- Today's goals tracker with checkboxes
- **Theme-aware interface**

### 💧 Water Intake Tracking
- Log daily water consumption
- Visual progress bar with gradients
- Quick add buttons (250ml, 500ml, 750ml, 1000ml)
- Custom amount input
- Weekly history chart
- Daily history list
- **Adapts to selected theme**

### 💪 Exercise Tracker with Photo Sharing
- **Photo Upload**: Share workout photos from camera or gallery
- **Mood Tracking**: Select from 8 different mood emojis
  - 💪 Energized, 😊 Happy, 🔥 On Fire, 😌 Relaxed
  - 😅 Tired, 🤩 Motivated, 😤 Determined, 🎉 Accomplished
- **Notes**: Add reflections and thoughts about workouts
- Track exercise name, duration, and calories burned
- Visual exercise history with photos and mood indicators
- Stats overview: Total calories, time, and workout count
- **Theme-aware modals and cards**

### 🧘 Wellness Tips
- Curated wellness and diet suggestions
- **Category filtering**: All, Diet, Mental, Fitness, Sleep
- Favorite tips functionality
- Recommended diet plans with beautiful gradients
- Search functionality
- **Themed cards and UI elements**

### 📊 Progress & Statistics
- **Weekly/Monthly toggle** for different time periods
- Total statistics (workouts, calories, water consumed, streak)
- **Weekly activity chart** with dual bars (water & exercise)
- **Achievement system** with 6 unlockable achievements:
  - Hydration Hero (7-day water streak)
  - Workout Warrior (10 workouts)
  - Streak Master (30-day streak)
  - Calorie Crusher (5000 calories)
  - Early Bird (5 morning workouts)
  - Consistency King (30-day activity)
- Progress tracking for each achievement
- **Theme-aware charts and cards**

### 👤 Profile & Settings (Unified!)
- User profile with avatar and quick stats
- **Editable profile information**: name, email, age, weight, height, goal
- **Built-in Settings**:
  - Water Reminders (toggle)
  - Exercise Reminders (toggle)
  - Weekly Reports (toggle)
  - Sound Effects (toggle)
- **Theme Selector**: Easy access via top-left button
- Additional menu: Privacy Policy, Terms, Help & Support, About
- Logout functionality
- **Fully theme-aware interface**

### ⏱️ Workout Timer
- Stopwatch mode for open-ended workouts
- Countdown timer with presets (5, 10, 20 minutes)
- Interval training with work/rest periods
- Visual progress indicators
- Audio alerts on completion

## Tech Stack

- **React Native** 0.73.0
- **React Navigation** - Bottom tab navigation
- **TypeScript** - Type safety
- **React Context API** - Theme management
- **AsyncStorage** - Local data persistence
- **React Native Linear Gradient** - Beautiful gradient UI
- **React Native Vector Icons** - Ionicons icon set
- **React Native Image Picker** - Photo upload from camera/gallery
- **React Native Chart Kit** - Progress charts and analytics
- **Notifee** - Local push notifications
- **React Native Safe Area Context** - Safe area handling

## Installation

### Prerequisites
- Node.js >= 18
- React Native development environment setup
- iOS: Xcode and CocoaPods
- Android: Android Studio and SDK

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **iOS specific (Mac only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Link React Native Vector Icons:**
   
   **iOS**: Already linked via CocoaPods
   
   **Android**: Add to `android/app/build.gradle`:
   ```gradle
   apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
   ```

4. **Configure permissions:**

   **iOS** (`ios/FitBuddy/Info.plist`):
   ```xml
   <key>NSPhotoLibraryUsageDescription</key>
   <string>We need access to your photo library to share workout photos</string>
   <key>NSCameraUsageDescription</key>
   <string>We need access to your camera to take workout photos</string>
   ```

   **Android** (`android/app/src/main/AndroidManifest.xml`):
   ```xml
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
   ```

## Running the App

### iOS
```bash
npm run ios
# or for specific device
npx react-native run-ios --device "iPhone 14"
```

### Android
```bash
npm run android
# or with specific device
adb devices
npx react-native run-android --deviceId=<device-id>
```

### Start Metro Bundler
```bash
npm start
```

## Project Structure

```
/
├── App-ReactNative.tsx          # Main app component with navigation
├── screens/
│   ├── HomeScreen.tsx           # Dashboard with quick stats
│   ├── ExerciseScreen.tsx       # Exercise tracking with photos
│   ├── WaterIntakeScreen.tsx    # Water logging
│   ├── WellnessScreen.tsx       # Wellness tips
│   ├── ProfileScreen.tsx        # User profile
│   ├── ProgressScreen.tsx       # Analytics and charts
│   └── SettingsScreen.tsx       # Notification settings
├── components/
│   ├── WorkoutTimerModal.tsx    # Timer for workouts
│   └── NotificationManager.tsx  # Push notifications
├── utils/
│   └── storage.ts              # AsyncStorage helpers
└── package-react-native.json   # Dependencies
```

## Key Features Implementation

### Photo Sharing
The exercise screen includes a full-featured photo sharing modal:
- Upload photos using React Native Image Picker
- Select mood emoji from 8 options
- Add workout notes and reflections
- Photos stored in AsyncStorage as base64 strings
- Display photos in exercise history feed

### Notifications
Using Notifee for local push notifications:
- Water reminders at customizable intervals
- Daily exercise reminders at set times
- Morning wellness tips at 9 AM
- Background notification scheduling

### Data Persistence
All data stored locally using AsyncStorage:
- Exercise history with photos, moods, and notes
- Water intake tracking
- User profile information
- Notification preferences
- No server or database required

### Responsive Design
- Adapts to different screen sizes
- Safe area handling for notched devices
- Optimized for both iOS and Android
- Smooth animations and transitions

## Build for Production

### iOS
```bash
# Open Xcode
open ios/FitBuddy.xcworkspace

# Select "Product" > "Archive" in Xcode
# Follow App Store submission process
```

### Android
```bash
cd android
./gradlew assembleRelease

# APK will be at:
# android/app/build/outputs/apk/release/app-release.apk
```

## Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache
npm start -- --reset-cache
```

### iOS Build Errors
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Android Build Errors
```bash
cd android
./gradlew clean
cd ..
npm run android
```

## Future Enhancements

- Social sharing of workout photos to Instagram/Facebook
- Cloud sync with Firebase or Supabase
- Apple Health & Google Fit integration
- Workout routines and programs
- Friend challenges and leaderboards
- Nutrition tracking
- Sleep tracking

## License

MIT License - feel free to use this project for learning or building your own fitness app!

## Support

For issues or questions:
- Check React Native documentation: https://reactnative.dev
- React Navigation: https://reactnavigation.org
- Notifee: https://notifee.app

---

Built with ❤️ using React Native