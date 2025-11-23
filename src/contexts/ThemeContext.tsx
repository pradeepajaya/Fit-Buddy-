import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface Theme {
  // Background colors
  background: string;
  backgroundSecondary: string;
  card: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Status bar
  statusBarStyle: 'light-content' | 'dark-content';
  
  // Border colors
  border: string;
  borderLight: string;
  
  // Accent colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Tab bar
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
  
  // Card shadows (for elevation)
  shadowColor: string;
  
  // Overlay
  overlay: string;
}

const lightTheme: Theme = {
  background: '#f9fafb',
  backgroundSecondary: '#ffffff',
  card: '#ffffff',
  
  text: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  
  primary: '#3b82f6',
  primaryLight: '#eff6ff',
  primaryDark: '#2563eb',
  
  statusBarStyle: 'dark-content',
  
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  tabBarBackground: '#ffffff',
  tabBarActive: '#3b82f6',
  tabBarInactive: '#6b7280',
  
  shadowColor: '#000',
  
  overlay: 'rgba(0, 0, 0, 0.5)',
};

const darkTheme: Theme = {
  background: '#111827',
  backgroundSecondary: '#1f2937',
  card: '#1f2937',
  
  text: '#f9fafb',
  textSecondary: '#d1d5db',
  textTertiary: '#9ca3af',
  
  primary: '#60a5fa',
  primaryLight: '#1e3a8a',
  primaryDark: '#93c5fd',
  
  statusBarStyle: 'light-content',
  
  border: '#374151',
  borderLight: '#4b5563',
  
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#60a5fa',
  
  tabBarBackground: '#1f2937',
  tabBarActive: '#60a5fa',
  tabBarInactive: '#9ca3af',
  
  shadowColor: '#000',
  
  overlay: 'rgba(0, 0, 0, 0.7)',
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  
  useEffect(() => {
    loadThemePreference();
  }, []);
  
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };
  
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  const getActiveTheme = (): Theme => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  };
  
  const theme = getActiveTheme();
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  
  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
