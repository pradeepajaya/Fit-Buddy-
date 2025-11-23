import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    email: string,
    password: string,
    name: string,
    dateOfBirth?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("currentUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    name: string,
    dateOfBirth?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const usersStr = await AsyncStorage.getItem("users");
      const users = usersStr ? JSON.parse(usersStr) : [];

      const existingUser = users.find(
        (u: any) => u.email === email || u.username === username
      );

      if (existingUser) {
        return {
          success: false,
          error: "User with this email or username already exists",
        };
      }

      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        name,
        dateOfBirth,
      };

      const userWithPassword = { ...newUser, password };
      users.push(userWithPassword);
      await AsyncStorage.setItem("users", JSON.stringify(users));

      setUser(newUser);
      await AsyncStorage.setItem("currentUser", JSON.stringify(newUser));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Registration failed. Please try again.",
      };
    }
  };

  const checkWaterIntakeReminder = async () => {
    try {
      const today = new Date().toDateString();
      const waterHistory = await AsyncStorage.getItem("waterHistory");

      if (waterHistory) {
        const history = JSON.parse(waterHistory);
        const todayData = history.find((item: any) => item.date === today);
        const todayAmount = todayData ? todayData.amount : 0;
        const goal = 2000; // 2L goal

        if (todayAmount < goal) {
          const remaining = goal - todayAmount;
          setTimeout(() => {
            Alert.alert(
              "💧 Stay Hydrated!",
              `You've consumed ${todayAmount}ml of water today. You need ${remaining}ml more to reach your 2L daily goal. Remember to drink water regularly!`,
              [
                { text: "Remind Me Later", style: "cancel" },
                { text: "OK", style: "default" },
              ]
            );
          }, 1500); // Show after 1.5 seconds
        }
      } else {
        // No water logged yet
        setTimeout(() => {
          Alert.alert(
            "💧 Water Intake Reminder",
            "Don't forget to track your water intake today! Staying hydrated is essential for your wellness journey. Daily goal: 2L",
            [
              { text: "Remind Me Later", style: "cancel" },
              { text: "OK", style: "default" },
            ]
          );
        }, 1500);
      }
    } catch (error) {
      console.error("Error checking water reminder:", error);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const usersStr = await AsyncStorage.getItem("users");
      const users = usersStr ? JSON.parse(usersStr) : [];

      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!foundUser) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }

      const { password: _, ...userWithoutPassword } = foundUser;

      setUser(userWithoutPassword);
      await AsyncStorage.setItem(
        "currentUser",
        JSON.stringify(userWithoutPassword)
      );

      // Show water intake reminder after successful login
      checkWaterIntakeReminder();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Login failed. Please try again.",
      };
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("currentUser");
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
