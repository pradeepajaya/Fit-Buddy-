import { useState } from "react";
import {
  Home,
  Droplets,
  Dumbbell,
  Heart,
  User,
  BarChart3,
  Settings,
} from "lucide-react";
import { HomePage } from "./components/HomePage";
import { WaterIntakePage } from "./components/WaterIntakePage";
import { ExercisePage } from "./components/ExercisePage";
import { WellnessPage } from "./components/WellnessPage";
import { ProfilePage } from "./components/ProfilePage";
import { ProgressPage } from "./components/ProgressPage";
import {
  NotificationManager,
  NotificationSettings,
} from "./components/NotificationManager";
import { Toaster } from "./components/ui/sonner";

type Page =
  | "home"
  | "water"
  | "exercise"
  | "wellness"
  | "profile"
  | "progress"
  | "settings";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "water":
        return <WaterIntakePage />;
      case "exercise":
        return <ExercisePage />;
      case "wellness":
        return <WellnessPage />;
      case "profile":
        return <ProfilePage />;
      case "progress":
        return <ProgressPage />;
      case "settings":
        return <NotificationSettings />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NotificationManager />
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto pb-20">{renderPage()}</div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around items-center py-3">
            <button
              onClick={() => setCurrentPage("home")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === "home"
                  ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={() => setCurrentPage("water")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === "water"
                  ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              }`}
            >
              <Droplets className="w-6 h-6" />
              <span className="text-xs">Water</span>
            </button>

            <button
              onClick={() => setCurrentPage("exercise")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === "exercise"
                  ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              }`}
            >
              <Dumbbell className="w-6 h-6" />
              <span className="text-xs">Exercise</span>
            </button>

            <button
              onClick={() => setCurrentPage("wellness")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === "wellness"
                  ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              }`}
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs">Wellness</span>
            </button>

            <button
              onClick={() => setCurrentPage("profile")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === "profile"
                  ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Profile</span>
            </button>

            <button
              onClick={() => setCurrentPage("progress")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === "progress"
                  ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              }`}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs">Progress</span>
            </button>

            <button
              onClick={() => setCurrentPage("settings")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === "settings"
                  ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              }`}
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs">Settings</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
