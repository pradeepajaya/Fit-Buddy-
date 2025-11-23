import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { HomePageNew } from "./components/HomePageNew";
import { WaterIntakePage } from "./components/WaterIntakePage";
import { ExercisePage } from "./components/ExercisePage";
import { WellnessPage } from "./components/WellnessPage";
import { ProfilePageNew } from "./components/ProfilePageNew";
import { ProgressPage } from "./components/ProgressPage";
import { FavoritesPage } from "./components/FavoritesPage";
import { NotificationManager } from "./components/NotificationManager";
import { Toaster } from "./components/ui/sonner";
import * as Icons from "react-feather";

type Page =
  | "home"
  | "water"
  | "exercise"
  | "wellness"
  | "profile"
  | "progress"
  | "favorites";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Auth Route Component
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Main App Layout with Navigation
function AppLayout() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NotificationManager />
      <Toaster position="top-center" />

      {/* Header with user info */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Icons.Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Fit Buddy
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Welcome, {user?.name || "User"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Icons.Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600" />
            <Icons.User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto pb-20">
        <Routes>
          <Route path="/" element={<HomePageNew />} />
          <Route path="/water" element={<WaterIntakePage />} />
          <Route path="/exercise" element={<ExercisePage />} />
          <Route path="/wellness" element={<WellnessPage />} />
          <Route path="/profile" element={<ProfilePageNew />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around items-center py-3">
            <NavButton
              icon={<Icons.Home className="w-6 h-6" />}
              label="Home"
              active={currentPage === "home"}
              onClick={() => setCurrentPage("home")}
              to="/"
            />
            <NavButton
              icon={<Icons.Heart className="w-6 h-6" />}
              label="Favorites"
              active={currentPage === "favorites"}
              onClick={() => setCurrentPage("favorites")}
              to="/favorites"
            />
            <NavButton
              icon={<Icons.Droplet className="w-6 h-6" />}
              label="Water"
              active={currentPage === "water"}
              onClick={() => setCurrentPage("water")}
              to="/water"
            />
            <NavButton
              icon={<Icons.Activity className="w-6 h-6" />}
              label="Exercise"
              active={currentPage === "exercise"}
              onClick={() => setCurrentPage("exercise")}
              to="/exercise"
            />
            <NavButton
              icon={<Icons.User className="w-6 h-6" />}
              label="Profile"
              active={currentPage === "profile"}
              onClick={() => setCurrentPage("profile")}
              to="/profile"
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  to: string;
}

function NavButton({ icon, label, active, onClick, to }: NavButtonProps) {
  const navigate = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <button
      onClick={navigate}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
        active
          ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
          : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}

// Auth Wrapper Component
function AuthWrapper() {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginPage onSwitchToRegister={() => setIsLogin(false)} />
  ) : (
    <RegisterPage onSwitchToLogin={() => setIsLogin(true)} />
  );
}

// Main App Component
export default function AppNew() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <AuthWrapper />
                </AuthRoute>
              }
            />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}
