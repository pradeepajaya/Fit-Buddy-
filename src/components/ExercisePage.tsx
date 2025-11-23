import { useState, useEffect } from "react";
import {
  History,
  X,
  Dumbbell,
  Target,
  Flame,
  TrendingUp,
  Bookmark,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { useDarkMode } from "../hooks/useDarkMode";

interface Exercise {
  id: string;
  name: string;
  type: string;
  muscle: string;
  duration: number;
  calories: number;
  difficulty: string;
  description: string;
  equipment?: string;
  instructions?: string;
}

interface ExerciseHistory {
  id: string;
  exerciseName: string;
  date: string;
  duration: number;
  calories: number;
  completed: boolean;
}

interface FitnessGoal {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
}

const exercises: Exercise[] = [
  {
    id: "1",
    name: "Jumping Jacks",
    type: "cardio",
    muscle: "full body",
    duration: 10,
    calories: 50,
    difficulty: "beginner",
    description: "A great cardio exercise to warm up and burn calories",
  },
  {
    id: "2",
    name: "Burpees",
    type: "cardio",
    muscle: "full body",
    duration: 15,
    calories: 100,
    difficulty: "intermediate",
    description: "High-intensity full body exercise",
  },
  {
    id: "3",
    name: "Push-ups",
    type: "strength",
    muscle: "chest",
    duration: 10,
    calories: 40,
    difficulty: "beginner",
    description: "Build upper body strength",
  },
  {
    id: "4",
    name: "Squats",
    type: "strength",
    muscle: "quadriceps",
    duration: 10,
    calories: 45,
    difficulty: "beginner",
    description: "Strengthen your legs and glutes",
  },
  {
    id: "5",
    name: "Plank",
    type: "strength",
    muscle: "abdominals",
    duration: 5,
    calories: 30,
    difficulty: "beginner",
    description: "Core strengthening exercise",
  },
  {
    id: "6",
    name: "Crunches",
    type: "strength",
    muscle: "abdominals",
    duration: 10,
    calories: 35,
    difficulty: "beginner",
    description: "Target your abs",
  },
  {
    id: "7",
    name: "Bicep Curls",
    type: "strength",
    muscle: "biceps",
    duration: 10,
    calories: 40,
    difficulty: "beginner",
    description: "Build arm strength",
  },
  {
    id: "8",
    name: "Lunges",
    type: "strength",
    muscle: "quadriceps",
    duration: 10,
    calories: 50,
    difficulty: "beginner",
    description: "Great for legs and balance",
  },
  {
    id: "9",
    name: "Yoga Flow",
    type: "stretching",
    muscle: "full body",
    duration: 20,
    calories: 60,
    difficulty: "beginner",
    description: "Improve flexibility and reduce stress",
  },
  {
    id: "10",
    name: "Mountain Climbers",
    type: "cardio",
    muscle: "full body",
    duration: 10,
    calories: 80,
    difficulty: "intermediate",
    description: "High-intensity cardio and core workout",
  },
];

const fitnessGoals: FitnessGoal[] = [
  {
    id: "burn_fat",
    name: "Burn Fat",
    icon: "🔥",
    color: "#ef4444",
    gradient: "from-red-400 to-orange-500",
    description: "High-intensity cardio exercises to maximize calorie burn",
  },
  {
    id: "build_muscle",
    name: "Build Muscle",
    icon: "💪",
    color: "#3b82f6",
    gradient: "from-blue-400 to-blue-600",
    description: "Strength training exercises to increase muscle mass",
  },
  {
    id: "toned_abs",
    name: "Toned Abs",
    icon: "🎯",
    color: "#8b5cf6",
    gradient: "from-purple-400 to-purple-600",
    description: "Core-focused exercises for defined abdominals",
  },
  {
    id: "arm_strength",
    name: "Arm Strength",
    icon: "🏋️",
    color: "#06b6d4",
    gradient: "from-cyan-400 to-cyan-600",
    description: "Upper body exercises for stronger arms",
  },
  {
    id: "leg_power",
    name: "Leg Power",
    icon: "🦵",
    color: "#10b981",
    gradient: "from-green-400 to-green-600",
    description: "Lower body exercises for powerful legs",
  },
  {
    id: "flexibility",
    name: "Flexibility",
    icon: "🧘",
    color: "#f59e0b",
    gradient: "from-amber-400 to-amber-600",
    description: "Stretching exercises to improve flexibility and mobility",
  },
];

export function ExercisePage() {
  const [isDark] = useDarkMode();
  const [history, setHistory] = useState<ExerciseHistory[]>([]);
  const [savedExercises, setSavedExercises] = useState<Exercise[]>([]);
  const [fitnessGoal, setFitnessGoal] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("exerciseHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      // Generate some sample history
      const sampleHistory = generateSampleHistory();
      setHistory(sampleHistory);
      localStorage.setItem("exerciseHistory", JSON.stringify(sampleHistory));
    }

    // Load saved exercises from localStorage
    const savedExercisesData = localStorage.getItem("savedExercises");
    if (savedExercisesData) {
      setSavedExercises(JSON.parse(savedExercisesData));
    }

    // Load fitness goal from localStorage
    const savedGoal = localStorage.getItem("fitnessGoal");
    if (savedGoal) {
      setFitnessGoal(savedGoal);
    }
  }, []);

  const generateSampleHistory = (): ExerciseHistory[] => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return [
      {
        id: "1",
        exerciseName: "Jumping Jacks",
        date: today.toISOString().split("T")[0],
        duration: 10,
        calories: 50,
        completed: true,
      },
      {
        id: "2",
        exerciseName: "Push-ups",
        date: today.toISOString().split("T")[0],
        duration: 10,
        calories: 40,
        completed: true,
      },
      {
        id: "3",
        exerciseName: "Squats",
        date: yesterday.toISOString().split("T")[0],
        duration: 10,
        calories: 45,
        completed: true,
      },
      {
        id: "4",
        exerciseName: "Plank",
        date: yesterday.toISOString().split("T")[0],
        duration: 5,
        calories: 30,
        completed: true,
      },
      {
        id: "5",
        exerciseName: "Burpees",
        date: today.toISOString().split("T")[0],
        duration: 15,
        calories: 100,
        completed: true,
      },
      {
        id: "6",
        exerciseName: "Crunches",
        date: yesterday.toISOString().split("T")[0],
        duration: 10,
        calories: 35,
        completed: true,
      },
      {
        id: "7",
        exerciseName: "Lunges",
        date: today.toISOString().split("T")[0],
        duration: 10,
        calories: 50,
        completed: true,
      },
      {
        id: "8",
        exerciseName: "Mountain Climbers",
        date: yesterday.toISOString().split("T")[0],
        duration: 10,
        calories: 80,
        completed: true,
      },
    ];
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayExercises = history.filter(
      (h) => h.date === today && h.completed
    );

    const caloriesBurnt = todayExercises.reduce(
      (sum, h) => sum + h.calories,
      0
    );
    const targetCalories = 500;
    const exercisesCompleted = todayExercises.length;
    const totalDuration = todayExercises.reduce(
      (sum, h) => sum + h.duration,
      0
    );

    return {
      caloriesBurnt,
      targetCalories,
      exercisesCompleted,
      totalDuration,
    };
  };

  const getGoalExercises = () => {
    switch (fitnessGoal) {
      case "burn_fat":
        return exercises.filter(
          (ex) =>
            ex.type === "cardio" ||
            ex.name.toLowerCase().includes("burpee") ||
            ex.name.toLowerCase().includes("jumping")
        );
      case "build_muscle":
        return exercises.filter(
          (ex) =>
            ex.type === "strength" &&
            (ex.difficulty === "intermediate" || ex.difficulty === "advanced")
        );
      case "toned_abs":
        return exercises.filter(
          (ex) =>
            ex.muscle === "abdominals" ||
            ex.muscle.toLowerCase().includes("abs")
        );
      case "arm_strength":
        return exercises.filter(
          (ex) =>
            ex.muscle === "biceps" ||
            ex.muscle === "triceps" ||
            ex.muscle === "chest"
        );
      case "leg_power":
        return exercises.filter(
          (ex) => ex.muscle === "quadriceps" || ex.muscle === "glutes"
        );
      case "flexibility":
        return exercises.filter((ex) => ex.type === "stretching");
      default:
        return [];
    }
  };

  const handleGoalClick = (goalId: string) => {
    setFitnessGoal(goalId);
    localStorage.setItem("fitnessGoal", goalId);
    setShowGoalDialog(false);
    setShowExercises(true);
  };

  const handleSaveExercise = (exercise: Exercise) => {
    const isAlreadySaved = savedExercises.some((ex) => ex.id === exercise.id);
    let updatedSaved;

    if (isAlreadySaved) {
      updatedSaved = savedExercises.filter((ex) => ex.id !== exercise.id);
    } else {
      updatedSaved = [...savedExercises, exercise];
    }

    setSavedExercises(updatedSaved);
    localStorage.setItem("savedExercises", JSON.stringify(updatedSaved));
  };

  const isExerciseSaved = (exerciseId: string) => {
    return savedExercises.some((ex) => ex.id === exerciseId);
  };

  const handleCompleteExercise = (exercise: Exercise) => {
    const today = new Date().toISOString().split("T")[0];
    const newHistory: ExerciseHistory = {
      id: Date.now().toString(),
      exerciseName: exercise.name,
      date: today,
      duration: exercise.duration,
      calories: exercise.calories,
      completed: true,
    };

    const updatedHistory = [...history, newHistory];
    setHistory(updatedHistory);
    localStorage.setItem("exerciseHistory", JSON.stringify(updatedHistory));
  };

  const stats = getTodayStats();
  const goalExercises = getGoalExercises();

  return (
    <div className="p-6 space-y-6">
      {/* Header with Icons */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Exercise Tracker
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowHistory(true)}
            variant="outline"
            className="flex items-center gap-1.5 px-3"
            size="sm"
          >
            <History className="w-5 h-5" />
            <span>Recent</span>
          </Button>
          <Button
            onClick={() => setShowSaved(true)}
            variant="outline"
            className="flex items-center gap-1.5 px-3 relative"
            size="sm"
          >
            <Bookmark className="w-5 h-5" />
            <span>Saved</span>
            {savedExercises.length > 0 && (
              <Badge className="ml-1 h-5 px-1.5 text-xs">
                {savedExercises.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Today's Analytics */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white border-0">
        <h2 className="text-xl font-semibold mb-4">Today's Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calories */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                <span className="font-medium">Calories</span>
              </div>
              <span className="text-sm">
                {stats.caloriesBurnt} / {stats.targetCalories}
              </span>
            </div>
            <Progress
              value={(stats.caloriesBurnt / stats.targetCalories) * 100}
              className="h-2 bg-white/20"
            />
            <p className="text-xs text-white/80">
              {stats.targetCalories - stats.caloriesBurnt > 0
                ? `${stats.targetCalories - stats.caloriesBurnt} cal to go`
                : "Target reached!"}
            </p>
          </div>

          {/* Exercises Count */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5" />
              <span className="font-medium">Exercises</span>
            </div>
            <p className="text-3xl font-bold">{stats.exercisesCompleted}</p>
            <p className="text-xs text-white/80">Completed today</p>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Duration</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalDuration} min</p>
            <p className="text-xs text-white/80">Total workout time</p>
          </div>
        </div>
      </Card>

      {/* Fitness Goals Selection */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Fitness Goal
          </h2>
          <Button
            onClick={() => setShowGoalDialog(true)}
            variant="outline"
            size="sm"
          >
            {fitnessGoal ? "Change Goal" : "Set Goal"}
          </Button>
        </div>

        {fitnessGoal ? (
          <Card className="p-6">
            {fitnessGoals
              .filter((g) => g.id === fitnessGoal)
              .map((goal) => (
                <div key={goal.id} className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-full bg-linear-to-br ${goal.gradient} flex items-center justify-center text-3xl shadow-md`}
                  >
                    {goal.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                      {goal.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {goal.description}
                    </p>
                  </div>
                  <Button onClick={() => setShowExercises(true)}>
                    View Exercises
                  </Button>
                </div>
              ))}
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              No Goal Set
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Set a fitness goal to get personalized exercise recommendations
            </p>
            <Button onClick={() => setShowGoalDialog(true)}>
              Set Your Goal
            </Button>
          </Card>
        )}
      </div>

      {/* Previous Exercises Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Exercise History
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No exercise history yet
              </p>
            ) : (
              history.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.exerciseName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.duration} min
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {item.calories} cal
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Goal Exercises Dialog */}
      <Dialog open={showExercises} onOpenChange={setShowExercises}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {fitnessGoals.find((g) => g.id === fitnessGoal)?.name} Exercises
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goalExercises.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8 col-span-2">
                No exercises available for this goal
              </p>
            ) : (
              goalExercises.map((exercise) => (
                <Card key={exercise.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {exercise.name}
                    </h3>
                    <Badge variant="secondary">{exercise.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {exercise.description}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{exercise.duration} min</span>
                    <span>{exercise.calories} cal</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSaveExercise(exercise)}
                      variant={
                        isExerciseSaved(exercise.id) ? "default" : "outline"
                      }
                      className="flex-1"
                      size="sm"
                    >
                      <Bookmark
                        className={`w-4 h-4 mr-1 ${
                          isExerciseSaved(exercise.id) ? "fill-current" : ""
                        }`}
                      />
                      {isExerciseSaved(exercise.id) ? "Saved" : "Save"}
                    </Button>
                    <Button
                      onClick={() => {
                        handleCompleteExercise(exercise);
                        setShowExercises(false);
                      }}
                      className="flex-1"
                      size="sm"
                    >
                      Complete
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Saved Exercises Dialog */}
      <Dialog open={showSaved} onOpenChange={setShowSaved}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bookmark className="w-5 h-5" />
              Saved Exercises
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedExercises.length === 0 ? (
              <div className="text-center py-8 col-span-2">
                <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-500 dark:text-gray-400">
                  No saved exercises yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Save exercises from the recommended list to access them
                  quickly
                </p>
              </div>
            ) : (
              savedExercises.map((exercise) => (
                <Card key={exercise.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {exercise.name}
                    </h3>
                    <Badge variant="secondary">{exercise.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {exercise.description}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{exercise.duration} min</span>
                    <span>{exercise.calories} cal</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSaveExercise(exercise)}
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      Remove
                    </Button>
                    <Button
                      onClick={() => {
                        handleCompleteExercise(exercise);
                        setShowSaved(false);
                      }}
                      className="flex-1"
                      size="sm"
                    >
                      Complete
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Goal Selection Dialog */}
      <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Select Your Fitness Goal
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fitnessGoals.map((goal) => {
              const isSelected = fitnessGoal === goal.id;
              return (
                <Card
                  key={goal.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    isSelected ? "ring-2 shadow-lg" : ""
                  }`}
                  style={isSelected ? { borderColor: goal.color } : {}}
                  onClick={() => handleGoalClick(goal.id)}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${goal.gradient} flex items-center justify-center text-3xl shadow-md`}
                    >
                      {goal.icon}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {goal.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {goal.description}
                    </p>
                    {isSelected && (
                      <Badge
                        className="mt-2"
                        style={{ backgroundColor: goal.color }}
                      >
                        Selected
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
