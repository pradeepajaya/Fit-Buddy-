import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
