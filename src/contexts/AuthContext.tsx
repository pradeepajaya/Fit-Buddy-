import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  dateOfBirth?: string;
  goals?: string[];
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
    dateOfBirth: string,
    goals: string[]
  ) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (
    email: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
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
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  const register = async (
    username: string,
    email: string,
    password: string,
    name: string,
    dateOfBirth: string,
    goals: string[]
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call - Using DummyJSON structure
      // In real app, this would call: POST https://dummyjson.com/users/add
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Check if user already exists
      const existingUser = users.find(
        (u: any) => u.email === email || u.username === username
      );

      if (existingUser) {
        return {
          success: false,
          error: "User with this email or username already exists",
        };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        name,
        dateOfBirth,
        goals,
      };

      // Store password separately (in real app, this would be hashed on server)
      const userWithPassword = { ...newUser, password };
      users.push(userWithPassword);
      localStorage.setItem("users", JSON.stringify(users));

      // Set current user
      setUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Registration failed. Please try again.",
      };
    }
  };

  const forgotPassword = async (
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const idx = users.findIndex((u: any) => u.email === email);
      if (idx === -1) {
        return { success: false, error: "No account found for this email" };
      }
      users[idx].password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Failed to reset password. Please try again.",
      };
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call - Using DummyJSON structure
      // In real app, this would call: POST https://dummyjson.com/auth/login
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!foundUser) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }

      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser;

      setUser(userWithoutPassword);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Login failed. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    forgotPassword,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
