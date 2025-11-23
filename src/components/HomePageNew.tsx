import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { useAuth } from "../contexts/AuthContext";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchExercises, setSelectedExercise } from "../store/exercisesSlice";
import { toggleFavorite } from "../store/favoritesSlice";
import { useDarkMode } from "../hooks/useDarkMode";
import * as Icons from "react-feather";

export function HomePageNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [isDark] = useDarkMode();
  const {
    items: exercises,
    loading,
    error,
  } = useAppSelector((state) => state.exercises);
  const favorites = useAppSelector((state) => state.favorites.items);

  // BMI Calculator state
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");

  useEffect(() => {
    if (exercises.length === 0) {
      dispatch(fetchExercises());
    }

    // Load BMI data from localStorage
    const storedWeight = localStorage.getItem("userWeight");
    const storedHeight = localStorage.getItem("userHeight");
    if (storedWeight && storedHeight) {
      setWeight(storedWeight);
      setHeight(storedHeight);
      calculateBMI(parseFloat(storedWeight), parseFloat(storedHeight));
    }
  }, [dispatch, exercises.length]);

  const calculateBMI = (weightKg: number, heightCm: number) => {
    if (weightKg > 0 && heightCm > 0) {
      const heightM = heightCm / 100;
      const bmiValue = weightKg / (heightM * heightM);
      setBmi(bmiValue);

      // Determine BMI category
      if (bmiValue < 18.5) {
        setBmiCategory("Underweight");
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setBmiCategory("Normal");
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setBmiCategory("Overweight");
      } else {
        setBmiCategory("Obese");
      }
    }
  };

  const handleCalculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (weightNum > 0 && heightNum > 0) {
      calculateBMI(weightNum, heightNum);
      // Save to localStorage
      localStorage.setItem("userWeight", weight);
      localStorage.setItem("userHeight", height);
    }
  };

  const getBMIColor = () => {
    if (!bmi) return "text-gray-600 dark:text-gray-400";
    if (bmi < 18.5) return "text-blue-600 dark:text-blue-400";
    if (bmi >= 18.5 && bmi < 25) return "text-green-600 dark:text-green-400";
    if (bmi >= 25 && bmi < 30) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getBMIBgColor = () => {
    if (!bmi) return "bg-gray-100 dark:bg-gray-700";
    if (bmi < 18.5) return "bg-blue-100 dark:bg-blue-900";
    if (bmi >= 18.5 && bmi < 25) return "bg-green-100 dark:bg-green-900";
    if (bmi >= 25 && bmi < 30) return "bg-orange-100 dark:bg-orange-900";
    return "bg-red-100 dark:bg-red-900";
  };

  const handleExerciseClick = (exercise: any) => {
    dispatch(setSelectedExercise(exercise));
    navigate("/exercise-detail");
  };

  const handleToggleFavorite = (e: React.MouseEvent, exercise: any) => {
    e.stopPropagation();
    dispatch(toggleFavorite(exercise));
  };

  const isFavorite = (exerciseName: string) => {
    return favorites.some((fav) => fav.name === exerciseName);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadge = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "Active";
      case "intermediate":
        return "Popular";
      case "advanced":
        return "Challenging";
      default:
        return "Available";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "cardio":
        return <Icons.Activity className="w-6 h-6" />;
      case "strength":
        return <Icons.Target className="w-6 h-6" />;
      default:
        return <Icons.Circle className="w-6 h-6" />;
    }
  };

  return (
    <div className="p-6 space-y-6 dark:bg-gray-900">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          Welcome back, {user?.name || "User"}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Ready to crush your fitness goals today?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Icons.Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Total Exercises
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {exercises.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-red-200 dark:border-red-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <Icons.Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-red-600 dark:text-red-300">
                Favorites
              </p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                {favorites.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200 dark:border-green-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Icons.TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-300">
                Progress
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                75%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* BMI Calculator */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 ${getBMIBgColor()} rounded-lg`}>
            <Icons.User className={`w-6 h-6 ${getBMIColor()}`} />
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-gray-100 font-semibold">
              BMI Calculator
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Track your body mass index
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Weight (kg)
              </label>
              <Input
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Height (cm)
              </label>
              <Input
                type="number"
                placeholder="170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          <Button
            onClick={handleCalculateBMI}
            className="w-full"
            disabled={!weight || !height}
          >
            Calculate BMI
          </Button>

          {bmi !== null && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Your BMI:
                </span>
                <span className={`text-2xl font-bold ${getBMIColor()}`}>
                  {bmi.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  Category:
                </span>
                <span className={`font-semibold ${getBMIColor()}`}>
                  {bmiCategory}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {bmi < 18.5 &&
                    "You may be underweight. Consider consulting a healthcare professional."}
                  {bmi >= 18.5 &&
                    bmi < 25 &&
                    "You have a healthy weight. Keep up the good work!"}
                  {bmi >= 25 &&
                    bmi < 30 &&
                    "You may be overweight. Consider a balanced diet and regular exercise."}
                  {bmi >= 30 &&
                    "You may be obese. Consult a healthcare professional for guidance."}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Exercises Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Available Exercises
          </h2>
          <Button
            onClick={() => dispatch(fetchExercises())}
            variant="outline"
            size="sm"
            className="dark:border-gray-600 dark:text-gray-300"
          >
            <Icons.RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Icons.Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
        )}

        {error && (
          <Card className="p-6 bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700">
            <div className="flex items-center gap-3">
              <Icons.AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  Error loading exercises
                </h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {!loading && !error && exercises.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise) => (
              <Card
                key={exercise.name}
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group dark:bg-gray-800 dark:border-gray-700"
                onClick={() => handleExerciseClick(exercise)}
              >
                <div className="p-6 space-y-4">
                  {/* Header with Icon and Favorite */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-lg ${
                          exercise.type === "cardio"
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                            : "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400"
                        } group-hover:scale-110 transition-transform`}
                      >
                        {getTypeIcon(exercise.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {exercise.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {exercise.muscle}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleToggleFavorite(e, exercise)}
                      className={`transition-colors ${
                        isFavorite(exercise.name)
                          ? "text-red-500 hover:text-red-700"
                          : "text-gray-300 dark:text-gray-600 hover:text-red-500"
                      }`}
                      title={
                        isFavorite(exercise.name)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <Icons.Heart
                        className={`w-6 h-6 ${
                          isFavorite(exercise.name) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700">
                      {getStatusBadge(exercise.difficulty)}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {exercise.instructions}
                  </p>

                  {/* Equipment */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Icons.Package className="w-4 h-4" />
                    <span className="capitalize">
                      {exercise.equipment.replace("_", " ")}
                    </span>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 group-hover:shadow-md transition-shadow">
                    <Icons.ArrowRight className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
