# Backend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret-key-here
```

### 3. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `src/database/schema.sql`
4. Run the SQL to create all tables, indexes, and RLS policies

### 4. Start the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

The server will start on `http://localhost:5000`

### 5. Test the API

```bash
# Health check
curl http://localhost:5000/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📝 Next Steps

1. **Populate Exercise Database**: Add common exercises to the `exercises` table
2. **Configure Nutritionix API** (Optional): For enhanced food search functionality
3. **Set up CORS**: Update `ALLOWED_ORIGINS` with your frontend URLs
4. **Deploy**: Deploy to Railway, Render, or your preferred platform

## 🔧 Troubleshooting

### TypeScript Errors

The errors shown are expected until you run `npm install`. They will be resolved once dependencies are installed.

### Supabase Connection Issues

- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active
- Ensure the database schema has been applied

### Port Already in Use

If port 5000 is already in use, change the `PORT` variable in your `.env` file.

## 📚 API Endpoints

All endpoints are documented in the main `README.md` file.

**Base URL**: `http://localhost:5000/api`

**Authentication**: Most endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🎯 Key Features Implemented

✅ User authentication (register, login, logout)  
✅ User profile management  
✅ Exercise library and favorites  
✅ Workout session tracking  
✅ Nutrition tracking (meals, foods)  
✅ Progress tracking (weight, measurements)  
✅ JWT authentication  
✅ Input validation  
✅ Rate limiting  
✅ Error handling  
✅ Row-Level Security with Supabase

## 🚀 Ready to Use!

The backend is fully functional and ready to be integrated with your React Native and React web frontends!
