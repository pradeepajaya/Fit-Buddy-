import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

import { store } from "./src/store";
import { setFavorites } from "./src/store/favoritesSlice";
import { AuthProvider, useAuth } from "./src/contexts/AuthContextRN";
import { ThemeProvider } from "./src/contexts/ThemeContextRN";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { HomeScreenRN } from "./src/screens/HomeScreenRN";
import { FavoritesScreen } from "./src/screens/FavoritesScreen";
import { ExercisesTrackerScreen } from "./src/screens/ExercisesTrackerScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { ProgressChartScreen } from "./src/screens/ProgressChartScreen";
import { DietPlannerScreen } from "./src/screens/DietPlannerScreen";
import { ExerciseDetailScreen } from "./src/screens/ExerciseDetailScreen";
import { WorkoutHistoryScreen } from "./src/screens/WorkoutHistoryScreen";
import { ShareWorkoutScreen } from "./src/screens/ShareWorkoutScreen";
import { FitnessJourneyScreen } from "./src/screens/FitnessJourneyScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Initialize demo user and load favorites
const initializeApp = async () => {
  // Initialize demo user
  const usersStr = await AsyncStorage.getItem("users");
  const users = usersStr ? JSON.parse(usersStr) : [];
  const demoUserExists = users.find(
    (u: any) => u.email === "demo@fitbuddy.com"
  );

  if (!demoUserExists) {
    const demoUser = {
      id: "demo-user-1",
      username: "demouser",
      email: "demo@fitbuddy.com",
      name: "Demo User",
      password: "demo123",
    };
    users.push(demoUser);
    await AsyncStorage.setItem("users", JSON.stringify(users));
  }

  // Load favorites
  try {
    const stored = await AsyncStorage.getItem("favorites");
    const favorites = stored ? JSON.parse(stored) : [];
    store.dispatch(setFavorites(favorites));
  } catch (error) {
    console.error("Failed to load favorites:", error);
  }
};

// Auth Navigator
function AuthNavigator() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthMain">
        {() =>
          isLogin ? (
            <LoginScreen onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterScreen onSwitchToLogin={() => setIsLogin(true)} />
          )
        }
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreenRN}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
          headerTitle: "Fit Buddy",
          headerStyle: {
            backgroundColor: "#2563EB",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Tab.Screen
        name="ExercisesTracker"
        component={ExercisesTrackerScreen}
        options={{
          tabBarLabel: "Exercises",
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size} color={color} />
          ),
          headerTitle: "Exercise Tracker",
          headerStyle: {
            backgroundColor: "#2563EB",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Tab.Screen
        name="ProgressChart"
        component={ProgressChartScreen}
        options={{
          tabBarLabel: "Progress",
          tabBarIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size} color={color} />
          ),
          headerTitle: "Progress",
          headerStyle: {
            backgroundColor: "#2563EB",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Tab.Screen
        name="FitnessJourney"
        component={FitnessJourneyScreen}
        options={{
          tabBarLabel: "Journal",
          tabBarIcon: ({ color, size }) => (
            <Feather name="book" size={size} color={color} />
          ),
          headerTitle: "Fitness Journal",
          headerStyle: {
            backgroundColor: "#2563EB",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: "#2563EB",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Tab.Navigator>
  );
}

// Root Navigator
function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DietPlanner"
            component={DietPlannerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ExerciseDetail"
            component={ExerciseDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="WorkoutHistory"
            component={WorkoutHistoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ShareWorkout"
            component={ShareWorkoutScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

// App Component
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await initializeApp();
      setIsReady(true);
    };
    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
