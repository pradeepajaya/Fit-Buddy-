# Fit Buddy Wellness App - Backend

A comprehensive REST API for the Fit Buddy Wellness App, built with Node.js, Express, TypeScript, and Supabase.

## 🚀 Features

- **Authentication**: JWT-based auth with Supabase
- **User Management**: User profiles, settings, and preferences
- **Exercise Tracking**: Exercise library, favorites, and workout sessions
- **Nutrition Tracking**: Food search, meal entries, and daily nutrition summaries
- **Progress Tracking**: Weight, measurements, body fat, and progress photos
- **Workout Management**: Create, track, and analyze workout sessions
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Database**: PostgreSQL with Supabase, Row-Level Security enabled

## 📋 Prerequisites

- Node.js 16+ and npm
- Supabase account and project
- (Optional) Nutritionix API credentials for food data

## 🛠️ Installation

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

3. **Configure `.env` file**

   ```env
   NODE_ENV=development
   PORT=5000

   # Supabase
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # JWT
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=7d

   # Nutritionix (Optional)
   NUTRITIONIX_APP_ID=your_app_id
   NUTRITIONIX_API_KEY=your_api_key

   # CORS
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Set up database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the schema from `src/database/schema.sql`

## 🏃 Running the Server

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile

```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update User Profile

```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "height": 175,
  "weight": 75,
  "age": 25,
  "gender": "male",
  "fitness_level": "intermediate",
  "daily_calorie_goal": 2000
}
```

### Exercise Endpoints

#### Get Exercises

```http
GET /api/exercises?category=strength&difficulty=intermediate
Authorization: Bearer <token>
```

#### Get Exercise by ID

```http
GET /api/exercises/:id
Authorization: Bearer <token>
```

#### Get Favorite Exercises

```http
GET /api/exercises/favorites/list
Authorization: Bearer <token>
```

#### Add Exercise to Favorites

```http
POST /api/exercises/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "exercise_id": "uuid"
}
```

### Nutrition Endpoints

#### Search Foods

```http
GET /api/nutrition/foods/search?query=chicken breast
Authorization: Bearer <token>
```

#### Get Meal Entries

```http
GET /api/nutrition/meals?date=2024-01-15
Authorization: Bearer <token>
```

#### Add Meal Entry

```http
POST /api/nutrition/meals
Authorization: Bearer <token>
Content-Type: application/json

{
  "food_item": {
    "name": "Chicken Breast",
    "calories": 165,
    "protein": 31,
    "carbs": 0,
    "fats": 3.6
  },
  "meal_type": "lunch",
  "servings": 1,
  "date": "2024-01-15"
}
```

#### Get Nutrition Summary

```http
GET /api/nutrition/summary?date=2024-01-15
Authorization: Bearer <token>
```

### Workout Endpoints

#### Get Workout Sessions

```http
GET /api/workouts?start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer <token>
```

#### Create Workout Session

```http
POST /api/workouts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Upper Body Workout",
  "date": "2024-01-15T10:00:00Z",
  "duration": 60,
  "calories_burned": 350,
  "exercises": [
    {
      "exercise_id": "uuid",
      "sets": 3,
      "reps": 10,
      "weight": 50
    }
  ]
}
```

#### Get Workout Stats

```http
GET /api/workouts/stats?start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer <token>
```

### Progress Endpoints

#### Get Progress Entries

```http
GET /api/progress?start_date=2024-01-01
Authorization: Bearer <token>
```

#### Create Progress Entry

```http
POST /api/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-01-15",
  "weight": 75,
  "body_fat_percentage": 15,
  "measurements": {
    "chest": 100,
    "waist": 80,
    "hips": 95
  },
  "notes": "Feeling good!"
}
```

#### Get Progress Stats

```http
GET /api/progress/stats?start_date=2024-01-01
Authorization: Bearer <token>
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.ts           # Supabase client configuration
│   ├── controllers/
│   │   ├── authController.ts      # Authentication logic
│   │   ├── userController.ts      # User management
│   │   ├── exerciseController.ts  # Exercise operations
│   │   ├── nutritionController.ts # Nutrition tracking
│   │   ├── workoutController.ts   # Workout sessions
│   │   └── progressController.ts  # Progress tracking
│   ├── middleware/
│   │   ├── auth.ts                # JWT authentication
│   │   ├── errorHandler.ts        # Error handling
│   │   └── validation.ts          # Input validation
│   ├── routes/
│   │   ├── auth.routes.ts         # Auth endpoints
│   │   ├── user.routes.ts         # User endpoints
│   │   ├── exercise.routes.ts     # Exercise endpoints
│   │   ├── nutrition.routes.ts    # Nutrition endpoints
│   │   ├── workout.routes.ts      # Workout endpoints
│   │   └── progress.routes.ts     # Progress endpoints
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   ├── database/
│   │   └── schema.sql             # Database schema
│   └── server.ts                  # Express app entry point
├── .env.example                   # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator for request validation
- **Row-Level Security**: Supabase RLS policies for data protection
- **Password Hashing**: bcrypt for secure password storage

## 🧪 Testing the API

Use the health check endpoint to verify the server is running:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "uptime": 123.456
}
```

## 📦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations (placeholder)

## 🌐 Environment Variables

| Variable                    | Description                            | Default                 |
| --------------------------- | -------------------------------------- | ----------------------- |
| `NODE_ENV`                  | Environment mode                       | `development`           |
| `PORT`                      | Server port                            | `5000`                  |
| `SUPABASE_URL`              | Supabase project URL                   | Required                |
| `SUPABASE_ANON_KEY`         | Supabase anonymous key                 | Required                |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key              | Required                |
| `JWT_SECRET`                | JWT signing secret                     | Required                |
| `JWT_EXPIRES_IN`            | Token expiration time                  | `7d`                    |
| `NUTRITIONIX_APP_ID`        | Nutritionix API app ID                 | Optional                |
| `NUTRITIONIX_API_KEY`       | Nutritionix API key                    | Optional                |
| `ALLOWED_ORIGINS`           | CORS allowed origins (comma-separated) | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS`      | Rate limit window in milliseconds      | `900000` (15 min)       |
| `RATE_LIMIT_MAX_REQUESTS`   | Max requests per window                | `100`                   |

## 🚀 Deployment

### Deploy to Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`
5. Set environment variables in Railway dashboard

### Deploy to Render

1. Connect your GitHub repository
2. Create a new Web Service
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@fitbuddy.com or open an issue in the repository.
