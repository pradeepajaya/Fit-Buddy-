# 🏃‍♂️ Fit Buddy Wellness App - Quick Start Guide

## 🚀 How to Run

1. **Install Dependencies** (if not already installed):

   ```bash
   npm install
   ```

2. **Start Development Server**:

   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:3000`

## 🔑 Login Credentials

### Demo User (Pre-configured)

- **Email**: demo@fitbuddy.com
- **Password**: demo123

### Or Create Your Own Account

Click "Sign Up" on the login page and register a new account.

## 🎯 Key Features to Test

### 1. Authentication

✅ Register a new account with validation
✅ Login with demo credentials
✅ See username in header after login
✅ Logout from Profile → Settings

### 2. Home Screen

✅ Browse exercise cards with icons
✅ See exercise difficulty badges (Active/Popular/Challenging)
✅ Click exercise card to view details
✅ Add/remove favorites using heart icon
✅ View loading state when fetching exercises

### 3. Exercise Details

✅ View full exercise information
✅ See badges for difficulty, equipment, muscle
✅ Add to favorites from detail page
✅ Navigate back to home

### 4. Favorites

✅ Click "Favorites" tab in bottom navigation
✅ View all favorited exercises
✅ See statistics (total, cardio, strength)
✅ Remove exercises from favorites
✅ Empty state when no favorites

### 5. Profile & Settings

✅ View and edit personal information
✅ See BMI calculation
✅ **Theme Settings**: Switch between Light/Dark/System
✅ Toggle push notifications
✅ Toggle email updates
✅ Logout button

### 6. Dark Mode

✅ Go to Profile → Settings
✅ Click theme options (Sun/Moon/Monitor icons)
✅ See theme change immediately
✅ Theme persists on page reload

## 📱 Navigation

### Bottom Tab Bar (5 Tabs)

1. **Home** - Browse exercises
2. **Favorites** - Your saved exercises
3. **Water** - Water intake tracker (existing feature)
4. **Exercise** - Exercise logger (existing feature)
5. **Profile** - User info & settings

## 🎨 UI Features

### Icons

All icons are from **Feather Icons** (react-feather):

- Activity, Heart, User, Home, Droplet
- Target, ArrowRight, Settings, Bell, Mail
- Sun, Moon, Monitor (for themes)
- And many more...

### Responsive Design

- Mobile: Single column layout
- Tablet: 2 column grid
- Desktop: 3 column grid
- Adaptive navigation

### Color Scheme

- Primary: Blue (600)
- Secondary: Green, Purple
- Gradients: Blue to Purple, Blue to Green
- Dark mode: Gray tones with blue accents

## 🔄 State Management Flow

### Redux Store Structure

```
store
├── exercises
│   ├── items: Exercise[]
│   ├── loading: boolean
│   ├── error: string | null
│   └── selectedExercise: Exercise | null
└── favorites
    └── items: Exercise[]
```

### Data Flow

1. User action (click exercise)
2. Dispatch Redux action
3. Update state
4. Components re-render
5. Persist to localStorage (for favorites)

## 💾 Data Persistence

### localStorage Keys

- `currentUser` - Authenticated user data
- `users` - All registered users
- `favorites` - Favorited exercises
- `theme` - Theme preference (light/dark/system)
- `notifications` - Notification setting
- `emailUpdates` - Email updates setting
- `userProfile` - User profile data

## 🧪 Testing Checklist

- [ ] Register new account
- [ ] Login with demo account
- [ ] Browse exercises on home
- [ ] Click exercise to view details
- [ ] Add exercise to favorites
- [ ] View favorites page
- [ ] Remove from favorites
- [ ] Edit profile information
- [ ] Change theme to dark mode
- [ ] Change theme to light mode
- [ ] Toggle notification settings
- [ ] Logout
- [ ] Login again (data persisted)

## 🐛 Troubleshooting

### Issue: Page shows loading forever

**Solution**: Check browser console for errors. Ensure all dependencies installed.

### Issue: Login doesn't work

**Solution**:

- Use demo credentials exactly as shown
- Or register a new account first

### Issue: Favorites not saving

**Solution**:

- Check if localStorage is enabled in browser
- Clear browser cache and try again

### Issue: Theme not changing

**Solution**:

- Ensure you're clicking the theme buttons in Profile → Settings
- Check browser console for errors

### Issue: Icons not showing

**Solution**:

- Ensure react-feather is installed: `npm install react-feather`
- Restart dev server

## 📋 Feature Checklist (Requirements Met)

### User Authentication ✅

- [x] Registration form with validation (Yup)
- [x] Login form with validation
- [x] React Hooks for form handling
- [x] Navigate to home on success
- [x] Username visible in header/profile
- [x] Secure local storage

### Navigation ✅

- [x] React Router DOM implementation
- [x] Bottom tab navigation (5 tabs)
- [x] Stack navigation (detail pages)
- [x] Protected routes

### Home Screen ✅

- [x] Dynamic exercise list from API
- [x] Cards with icon, title, description
- [x] Status badges (Active/Popular/Challenging)
- [x] Responsive layout

### Item Interaction ✅

- [x] Tap item to open details
- [x] Redux Toolkit state management
- [x] Proper data flow

### Favorites ✅

- [x] Mark items as favorites
- [x] Separate favorites screen
- [x] Persist to localStorage
- [x] Heart icon toggle

### Styling ✅

- [x] Consistent, clean design
- [x] Feather Icons throughout
- [x] Responsive for all screen sizes
- [x] Professional UI/UX

### Bonus Features ✅

- [x] Dark mode toggle
- [x] Settings in profile page
- [x] Theme persistence
- [x] Multiple theme options

### Best Practices ✅

- [x] Decoupled code
- [x] Reusable components
- [x] Type-safe with TypeScript
- [x] Proper validation
- [x] Industry standards

## 🎓 Code Examples

### Adding to Favorites

```typescript
import { useAppDispatch } from "../store/hooks";
import { toggleFavorite } from "../store/favoritesSlice";

const dispatch = useAppDispatch();
dispatch(toggleFavorite(exercise));
```

### Checking if Favorited

```typescript
import { useAppSelector } from "../store/hooks";

const favorites = useAppSelector((state) => state.favorites.items);
const isFavorite = favorites.some((fav) => fav.name === exerciseName);
```

### Changing Theme

```typescript
const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
  setTheme(newTheme);
  localStorage.setItem("theme", newTheme);
  if (newTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};
```

## 📞 Support

For issues or questions:

1. Check IMPLEMENTATION-GUIDE.md for detailed documentation
2. Review browser console for errors
3. Ensure all dependencies are installed
4. Try clearing browser cache/localStorage

---

**Enjoy using Fit Buddy! 💪**
