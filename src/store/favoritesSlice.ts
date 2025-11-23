import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exercise } from './exercisesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesState {
  items: Exercise[];
}

const loadFavoritesFromStorage = async (): Promise<Exercise[]> => {
  try {
    const stored = await AsyncStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load favorites:', error);
    return [];
  }
};

const saveFavoritesToStorage = async (favorites: Exercise[]) => {
  try {
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<Exercise[]>) => {
      state.items = action.payload;
    },
    addFavorite: (state, action: PayloadAction<Exercise>) => {
      const exists = state.items.find(item => item.name === action.payload.name);
      if (!exists) {
        state.items.push(action.payload);
        saveFavoritesToStorage(state.items);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.name !== action.payload);
      saveFavoritesToStorage(state.items);
    },
    toggleFavorite: (state, action: PayloadAction<Exercise>) => {
      const index = state.items.findIndex(item => item.name === action.payload.name);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      saveFavoritesToStorage(state.items);
    },
  },
});

export const { setFavorites, addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
