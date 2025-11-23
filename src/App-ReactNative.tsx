import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

import HomeScreen from './screens/HomeScreen';
import WaterIntakeScreen from './screens/WaterIntakeScreen';
import ExerciseScreen from './screens/ExerciseScreen';
import WellnessScreen from './screens/WellnessScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProgressScreen from './screens/ProgressScreen';

const Tab = createBottomTabNavigator();

function AppContent() {
  const { theme, isDark } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle={theme.statusBarStyle} 
        backgroundColor={theme.background}
      />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;

              switch (route.name) {
                case 'Home':
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                case 'Water':
                  iconName = focused ? 'water' : 'water-outline';
                  break;
                case 'Exercise':
                  iconName = focused ? 'barbell' : 'barbell-outline';
                  break;
                case 'Wellness':
                  iconName = focused ? 'heart' : 'heart-outline';
                  break;
                case 'Progress':
                  iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                  break;
                case 'Profile':
                  iconName = focused ? 'person' : 'person-outline';
                  break;
                default:
                  iconName = 'circle';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme.tabBarActive,
            tabBarInactiveTintColor: theme.tabBarInactive,
            tabBarStyle: {
              backgroundColor: theme.tabBarBackground,
              borderTopWidth: 1,
              borderTopColor: theme.border,
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 11,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Water" component={WaterIntakeScreen} />
          <Tab.Screen name="Exercise" component={ExerciseScreen} />
          <Tab.Screen name="Wellness" component={WellnessScreen} />
          <Tab.Screen name="Progress" component={ProgressScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}