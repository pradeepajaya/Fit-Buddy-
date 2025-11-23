import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from './exercisesSlice';
import favoritesReducer from './favoritesSlice';

export const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
