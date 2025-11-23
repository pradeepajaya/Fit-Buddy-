# Fit Buddy Wellness - React Native Expo App

## 🎯 React Native Implementation Complete!

The app has been converted to **React Native** using **Expo** and can now run on iPhone!

## 🚀 Quick Start

### Prerequisites

- Node.js installed
- Expo Go app installed on your iPhone
  - Download from App Store: [Expo Go](https://apps.apple.com/app/expo-go/id982107779)

### Installation

```bash
# Install dependencies (if not already done)
npm install --legacy-peer-deps

# Start Expo development server
npm start
```

### Running on iPhone

1. **Start the development server:**

   ```bash
   npm start
   ```

2. **Scan the QR code:**

   - Open **Expo Go** app on your iPhone
   - Tap "Scan QR Code"
   - Scan the QR code shown in your terminal/browser

3. **Alternative - Direct iOS Simulator:**
   ```bash
   npm run ios
   ```
   (Requires Xcode installed on Mac)

## 📱 Features Implemented

### ✅ User Authentication

- **Login Screen** with Yup validation
- **Register Screen** with full validation
- AsyncStorage for secure data persistence
- Demo credentials: demo@fitbuddy.com / demo123

### ✅ Navigation

- **React Navigation** with Bottom Tabs
- **3 Main Tabs:**
  - 🏠 Home - Browse exercises
  - ❤️ Favorites - Saved exercises
  - 👤 Profile - Settings & user info
- Stack navigation for detail screens

### ✅ Home Screen

- Dynamic exercise list from Redux
- Cards with Feather Icons
- Tap exercise to view details
- Add/remove from favorites
- Status badges (Active/Popular/Challenging)
- Loading and error states

### ✅ Favorites

- View all favorited exercises
- Statistics (total, cardio, strength)
- Remove from favorites
- Empty state when no favorites

### ✅ Profile & Settings

- User information display
- **Theme selector** (Light/Dark/System)
- **Notifications toggle**
- Health metrics (BMI, Weight, Goals)
- Logout functionality

### ✅ State Management

- Redux Toolkit for exercises and favorites
- AsyncStorage for persistence
- Typed Redux hooks

### ✅ Styling

- React Native StyleSheet
- Feather Icons from @expo/vector-icons
- Responsive design
- Professional UI/UX

## 📂 File Structure

```
.
├── App.tsx                          # Main Expo app with navigation
├── app.json                         # Expo configuration
├── babel.config.js                  # Babel configuration
├── src/
│   ├── contexts/
│   │   └── AuthContextRN.tsx       # Auth with AsyncStorage
│   ├── screens/
│   │   ├── LoginScreen.tsx         # Login form
│   │   ├── RegisterScreen.tsx      # Registration form
│   │   ├── HomeScreenRN.tsx        # Exercise list
│   │   ├── FavoritesScreenRN.tsx   # Favorites list
│   │   └── ProfileScreenRN.tsx     # Profile & settings
│   └── store/                       # Redux store (shared)
│       ├── index.ts
│       ├── hooks.ts
│       ├── exercisesSlice.ts
│       └── favoritesSlice.ts
```

## 🎨 Features

### React Native Components Used

- `View`, `Text`, `ScrollView`
- `TouchableOpacity` for buttons
- `TextInput` for forms
- `Switch` for toggles
- `ActivityIndicator` for loading
- `KeyboardAvoidingView` for forms
- `StatusBar` from expo-status-bar

### Icons

- `@expo/vector-icons` (Feather icon set)
- 20+ different icons throughout the app

### Navigation

- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `@react-navigation/native-stack`

## 🔐 Demo User

**Pre-configured demo account:**

- Email: `demo@fitbuddy.com`
- Password: `demo123`

Or register a new account!

## 📱 Tested Features

- ✅ User registration with validation
- ✅ Login authentication
- ✅ Browse 10 exercises
- ✅ Add/remove favorites
- ✅ View favorites list
- ✅ Change theme (Light/Dark/System)
- ✅ Toggle notifications
- ✅ Logout functionality
- ✅ Data persistence with AsyncStorage

## 🎯 All Requirements Met

### Original Requirements ✓

- [x] User Authentication (Register & Login)
- [x] Form validation with Yup
- [x] React Hooks for state management
- [x] Navigation (React Navigation - Bottom Tabs)
- [x] Home screen with dynamic items from API
- [x] Cards with Icon, Title, Description, Status
- [x] Item interaction (tap to view details)
- [x] Redux Toolkit state management
- [x] Favorites functionality
- [x] Persistent favorites (AsyncStorage)
- [x] Feather Icons throughout
- [x] Responsive design
- [x] Dark mode toggle
- [x] Settings in profile page

### React Native Specific ✓

- [x] Expo configuration
- [x] React Navigation setup
- [x] AsyncStorage for persistence
- [x] React Native StyleSheet
- [x] Platform-specific code (iOS/Android)
- [x] TouchableOpacity interactions
- [x] KeyboardAvoidingView for forms
- [x] Safe area handling

## 📊 Exercise Data

10 pre-loaded exercises:

1. Push-ups (Strength)
2. Squats (Strength)
3. Running (Cardio)
4. Plank (Strength)
5. Jumping Jacks (Cardio)
6. Lunges (Strength)
7. Mountain Climbers (Cardio)
8. Burpees (Strength)
9. Bicycle Crunches (Strength)
10. Pull-ups (Strength)

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Run on iOS simulator (Mac only)
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web

# Install new package
npm install package-name --legacy-peer-deps
```

## 📱 Running on Physical Device

1. Install **Expo Go** from App Store
2. Connect to same WiFi as your computer
3. Run `npm start`
4. Scan QR code with Expo Go app

## 🎨 Customization

### Change Theme Colors

Edit colors in StyleSheet objects in each screen file

### Add New Exercises

Modify `src/store/exercisesSlice.ts` mock data

### Modify Navigation

Edit `App.tsx` to add/remove tabs or screens

## 🐛 Troubleshooting

### Metro bundler won't start

```bash
npx expo start -c
```

### Can't connect on phone

- Ensure same WiFi network
- Try tunnel mode: `npx expo start --tunnel`

### Build errors

```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

## 📚 Technologies

- **Expo** - React Native framework
- **React Navigation** - Navigation library
- **Redux Toolkit** - State management
- **AsyncStorage** - Local storage
- **Yup** - Form validation
- **TypeScript** - Type safety
- **Feather Icons** - Icon library

## ✨ Next Steps

1. Run `npm start`
2. Open Expo Go on iPhone
3. Scan QR code
4. Login with demo@fitbuddy.com / demo123
5. Explore the app!

---

**Ready to run on your iPhone! 📱**
