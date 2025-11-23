# 🏋️ Fit Buddy Wellness App

A comprehensive fitness and wellness mobile application built with React Native (Expo) and a web version with React + Vite.

## ✨ Features

### 🏠 Home Screen

- **BMI Calculator** - Track your Body Mass Index with color-coded categories
- **Water Intake Tracker** - Monitor daily hydration goals
- **Daily Wellness Tips** - Motivational health advice
- **Quick Stats** - Overview of exercises, favorites, and progress

### 💪 Exercise Tracking

- **Fitness Goals** - Choose from 6 personalized fitness goals:
  - Burn Fat
  - Build Muscle
  - Toned Abs
  - Arm Strength
  - Leg Power
  - Flexibility
- **Recommended Exercises** - AI-curated workout suggestions based on your goals
- **Exercise Library** - 20+ pre-loaded exercises with details
- **Save Favorites** - Bookmark your preferred workouts
- **Exercise History** - Track completed workouts

### 🍎 Diet Planner

- **Multi-select Food Selection** - Choose multiple foods at once
- **45+ Food Items** - Categorized by breakfast, lunch, dinner, snacks
- **Calorie Tracking** - Monitor daily caloric intake
- **Meal Planning** - Organize daily meals

### 📊 Progress Tracking

- **BMI Monitoring** - Track body composition over time
- **Workout History** - View exercise completion stats
- **Health Metrics** - Weight, height, and fitness goals

### 👤 User Profile

- **Profile Picture Upload** - Change your avatar (uses device camera/gallery)
- **Dark Mode Toggle** - Switch between light and dark themes
- **Account Management** - View and update personal information

### 🔐 Authentication

- **Registration** with username, email, password, date of birth
- **Login** with secure password handling
- **Persistent Sessions** using AsyncStorage
- **Forgot Password** functionality

## 🛠️ Tech Stack

### Mobile App (React Native)

- **Framework**: Expo 54.0.25
- **Language**: TypeScript 5.9.2
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation v6
- **Storage**: AsyncStorage
- **Icons**: Expo Vector Icons (Feather)
- **Image Picker**: expo-image-picker
- **Validation**: Yup

### Web App (React)

- **Build Tool**: Vite 6.3.5
- **Framework**: React 19.1.0
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Components**: Radix UI
- **Icons**: Lucide React

### Backend (Node.js)

- **Runtime**: Node.js with Express 4.18.2
- **Language**: TypeScript 5.3.3
- **Database**: Supabase
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Security**: Helmet, CORS, bcryptjs
- **Validation**: Express Validator

## 📱 Installation & Setup

### Prerequisites

- Node.js 16+ installed
- npm or yarn
- Expo Go app (for mobile testing)
- Android Studio or Xcode (for emulator)

### Mobile App Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/fit-buddy-wellness-app.git
cd fit-buddy-wellness-app
```

2. **Install dependencies**

```bash
npm install --legacy-peer-deps
```

3. **Start Expo development server**

```bash
npx expo start
```

4. **Run on device**

- Install **Expo Go** on your phone
- Scan the QR code displayed in terminal
- Or press `a` for Android emulator, `i` for iOS simulator

### Web App Setup

1. **Install dependencies** (if not done already)

```bash
npm install --legacy-peer-deps
```

2. **Start Vite development server**

```bash
npm run dev
```

3. **Open in browser**

- Navigate to `http://localhost:3000`

### Backend Setup

1. **Navigate to backend folder**

```bash
cd backend
npm install
```

2. **Configure Supabase**

- Create a Supabase project at https://supabase.com
- Copy your project URL and anon key
- Create `.env` file:

```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your_jwt_secret
PORT=5000
```

3. **Run database migrations**

- Execute `backend/src/database/schema.sql` in Supabase SQL Editor
- Execute `backend/src/database/seed-data.sql` for sample data

4. **Start backend server**

```bash
npm run dev
```

## 🎨 App Features Walkthrough

### Registration & Login

1. **Register** with username, email, password, and date of birth
2. **Login** with email and password
3. **Forgot Password** option available on login screen

### Home Screen

1. View personalized greeting
2. Calculate BMI by entering weight and height
3. Track water intake (add glasses throughout the day)
4. Read daily wellness tips
5. Access Diet Planner

### Exercises

1. Select a fitness goal (Burn Fat, Build Muscle, etc.)
2. View recommended exercises based on goal
3. Save exercises to favorites
4. Track exercise history
5. View detailed exercise information

### Diet Planning

1. Browse 45+ food items categorized by meal type
2. Multi-select foods for each meal
3. View total calories for the day
4. Customize breakfast, lunch, dinner, and snacks

### Profile

1. Upload profile picture from gallery/camera
2. Toggle dark mode
3. View account information
4. Logout

## 📂 Project Structure

```
Fit Buddy Wellness App/
├── src/
│   ├── components/        # Web React components
│   ├── contexts/          # Auth & Theme contexts
│   ├── hooks/             # Custom hooks (useDarkMode)
│   ├── screens/           # Mobile React Native screens
│   ├── store/             # Redux slices
│   └── utils/             # Helper functions
├── backend/
│   └── src/
│       ├── config/        # Supabase config
│       ├── controllers/   # API controllers
│       ├── database/      # SQL schemas & seeds
│       ├── middleware/    # Auth, validation, error handling
│       ├── routes/        # Express routes
│       └── types/         # TypeScript types
├── App.tsx                # Mobile app entry
├── AppNew.tsx             # Web app entry (active)
├── package.json
└── README.md
```

## 🔑 Key Files

- **Mobile Home**: `src/screens/HomeScreenRN.tsx` (BMI calculator, water tracker)
- **Web Home**: `src/components/HomePageNew.tsx` (BMI calculator)
- **Exercise Tracker**: `src/screens/ExercisesTrackerScreen.tsx`
- **Diet Planner**: `src/screens/DietPlannerScreen.tsx`
- **Profile**: `src/screens/ProfileScreenRN.tsx` (profile picture upload)
- **Auth Context**: `src/contexts/AuthContextRN.tsx` (registration with DOB)
- **Theme Context**: `src/contexts/ThemeContextRN.tsx` (dark mode)

## 🌙 Dark Mode

The app supports dark mode on both mobile and web:

- **Mobile**: Toggle in Profile > Settings > Theme
- **Web**: Toggle in Profile page (Moon/Sun icon)
- Uses theme context with persistent storage

## 🚀 Deployment

### Mobile (Expo)

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### Web (Vite)

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👥 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 🐛 Known Issues

- Backend requires Supabase credentials to function
- Some React type version conflicts (using @types/react@19.1.10)

## 📞 Support

For issues or questions, please open a GitHub issue or contact the development team.

---

**Built with ❤️ for fitness enthusiasts**
