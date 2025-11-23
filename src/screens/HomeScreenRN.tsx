import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContextRN";
import { useTheme } from "../contexts/ThemeContextRN";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchExercises, setSelectedExercise } from "../store/exercisesSlice";
import { toggleFavorite } from "../store/favoritesSlice";

const wellnessTips = [
  "💧 Stay hydrated! Drink at least 8 glasses of water today.",
  "🧘 Take short breaks to stretch every hour.",
  "🥗 Include colorful fruits and vegetables in your meals.",
  "😴 Aim for 7-9 hours of quality sleep tonight.",
  "🚶 Take a 10-minute walk after meals for better digestion.",
  "🧠 Practice mindfulness for 5 minutes daily.",
  "💪 Consistency beats intensity - stay regular with your workouts!",
];

interface Food {
  id: string;
  name: string;
  category: string;
  calories: number;
  emoji: string;
}

const DEFAULT_DIET = {
  breakfast: [
    {
      id: "1",
      name: "Avocado Toast",
      category: "breakfast",
      calories: 320,
      emoji: "🥑",
    },
    {
      id: "2",
      name: "Boiled Eggs",
      category: "breakfast",
      calories: 155,
      emoji: "🥚",
    },
    {
      id: "3",
      name: "Orange Juice",
      category: "breakfast",
      calories: 110,
      emoji: "🥤",
    },
  ],
  lunch: [
    {
      id: "7",
      name: "Grilled Chicken",
      category: "lunch",
      calories: 285,
      emoji: "🍗",
    },
    {
      id: "8",
      name: "Caesar Salad",
      category: "lunch",
      calories: 180,
      emoji: "🥗",
    },
    {
      id: "9",
      name: "Brown Rice",
      category: "lunch",
      calories: 215,
      emoji: "🍚",
    },
  ],
  dinner: [
    {
      id: "13",
      name: "Salmon",
      category: "dinner",
      calories: 350,
      emoji: "🐟",
    },
    {
      id: "14",
      name: "Broccoli",
      category: "dinner",
      calories: 55,
      emoji: "🥦",
    },
    {
      id: "15",
      name: "Sweet Potato",
      category: "dinner",
      calories: 180,
      emoji: "🥔",
    },
  ],
};

export function HomeScreenRN() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const {
    items: exercises,
    loading,
    error,
  } = useAppSelector((state) => state.exercises);
  const favorites = useAppSelector((state) => state.favorites.items);

  const [waterIntake, setWaterIntake] = useState(5); // glasses consumed
  const waterGoal = 8; // daily goal
  const [dailyTip] = useState(
    wellnessTips[Math.floor(Math.random() * wellnessTips.length)]
  );
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
  const [mealPlan, setMealPlan] = useState(DEFAULT_DIET);

  // BMI Calculator state
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");

  useEffect(() => {
    if (exercises.length === 0) {
      dispatch(fetchExercises());
    }
    loadSelectedFoods();
    loadBMIData();
  }, [dispatch, exercises.length]);

  useEffect(() => {
    // Add listener to reload foods when screen is focused
    const unsubscribe = navigation.addListener("focus", () => {
      loadSelectedFoods();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Update meal plan when selected foods change
    if (selectedFoods.length > 0) {
      const breakfast = selectedFoods
        .filter((f) => f.category === "breakfast")
        .slice(0, 3);
      const lunch = selectedFoods
        .filter((f) => f.category === "lunch")
        .slice(0, 3);
      const dinner = selectedFoods
        .filter((f) => f.category === "dinner")
        .slice(0, 3);

      setMealPlan({
        breakfast: breakfast.length > 0 ? breakfast : DEFAULT_DIET.breakfast,
        lunch: lunch.length > 0 ? lunch : DEFAULT_DIET.lunch,
        dinner: dinner.length > 0 ? dinner : DEFAULT_DIET.dinner,
      });
    }
  }, [selectedFoods]);

  const loadSelectedFoods = async () => {
    try {
      const stored = await AsyncStorage.getItem("selectedFoods");
      if (stored) {
        setSelectedFoods(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load selected foods:", error);
    }
  };

  const handleExercisePress = (exercise: any) => {
    dispatch(setSelectedExercise(exercise));
    navigation.navigate("ExerciseDetail");
  };

  const handleToggleFavorite = (exercise: any) => {
    dispatch(toggleFavorite(exercise));
  };

  const isFavorite = (exerciseName: string) => {
    return favorites.some((fav) => fav.name === exerciseName);
  };

  const addWater = () => {
    if (waterIntake < waterGoal) {
      setWaterIntake(waterIntake + 1);
    }
  };

  const loadBMIData = async () => {
    try {
      const storedWeight = await AsyncStorage.getItem("userWeight");
      const storedHeight = await AsyncStorage.getItem("userHeight");
      if (storedWeight && storedHeight) {
        setWeight(storedWeight);
        setHeight(storedHeight);
        calculateBMI(parseFloat(storedWeight), parseFloat(storedHeight));
      }
    } catch (error) {
      console.error("Failed to load BMI data:", error);
    }
  };

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

  const handleCalculateBMI = async () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (weightNum > 0 && heightNum > 0) {
      calculateBMI(weightNum, heightNum);
      // Save to AsyncStorage
      try {
        await AsyncStorage.setItem("userWeight", weight);
        await AsyncStorage.setItem("userHeight", height);
      } catch (error) {
        console.error("Failed to save BMI data:", error);
      }
    }
  };

  const getBMIColor = () => {
    if (!bmi) return "#6B7280";
    if (bmi < 18.5) return "#3B82F6";
    if (bmi >= 18.5 && bmi < 25) return "#10B981";
    if (bmi >= 25 && bmi < 30) return "#F59E0B";
    return "#EF4444";
  };

  const getBMIBgColor = () => {
    if (!bmi) return isDark ? "#374151" : "#F3F4F6";
    if (bmi < 18.5) return isDark ? "#1E3A8A" : "#DBEAFE";
    if (bmi >= 18.5 && bmi < 25) return isDark ? "#065F46" : "#D1FAE5";
    if (bmi >= 25 && bmi < 30) return isDark ? "#78350F" : "#FEF3C7";
    return isDark ? "#7F1D1D" : "#FEE2E2";
  };

  const getBMIAdvice = () => {
    if (!bmi) return "";
    if (bmi < 18.5)
      return "You may be underweight. Consider consulting a healthcare professional.";
    if (bmi >= 18.5 && bmi < 25)
      return "You have a healthy weight. Keep up the good work!";
    if (bmi >= 25 && bmi < 30)
      return "You may be overweight. Consider a balanced diet and regular exercise.";
    return "You may be obese. Consult a healthcare professional for guidance.";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "#10B981";
      case "intermediate":
        return "#F59E0B";
      case "advanced":
        return "#EF4444";
      default:
        return "#6B7280";
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header with Favorites Icon */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.primary }]}>
            Welcome back, {user?.name || "User"}!
          </Text>
          <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
            Ready to crush your fitness goals today?
          </Text>
        </View>
        <TouchableOpacity
          style={styles.favoritesIconButton}
          onPress={() => navigation.navigate("Favorites")}
        >
          <Feather name="heart" size={24} color="#EF4444" />
          {favorites.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{favorites.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Wellness Tip */}
      <View
        style={[
          styles.wellnessTipCard,
          {
            backgroundColor: isDark ? "#422006" : "#FFFBEB",
            borderLeftColor: "#F59E0B",
          },
        ]}
      >
        <View style={styles.tipHeader}>
          <Feather name="sun" size={20} color="#F59E0B" />
          <Text
            style={[styles.tipTitle, { color: isDark ? "#FDE68A" : "#92400E" }]}
          >
            Daily Wellness Tip
          </Text>
        </View>
        <Text
          style={[styles.tipText, { color: isDark ? "#FDE047" : "#78350F" }]}
        >
          {dailyTip}
        </Text>
      </View>

      {/* Water Goal Tracker */}
      <View style={[styles.waterCard, { backgroundColor: colors.card }]}>
        <View style={styles.waterHeader}>
          <View style={styles.waterTitleContainer}>
            <Feather name="droplet" size={20} color="#3B82F6" />
            <Text style={[styles.waterTitle, { color: colors.text }]}>
              Water Intake
            </Text>
          </View>
          <Text style={styles.waterProgress}>
            {waterIntake}/{waterGoal} glasses
          </Text>
        </View>
        <View style={styles.waterProgressBar}>
          <View
            style={[
              styles.waterProgressFill,
              { width: `${(waterIntake / waterGoal) * 100}%` },
            ]}
          />
        </View>
        <View style={styles.waterActions}>
          <Text style={styles.waterPercentage}>
            {Math.round((waterIntake / waterGoal) * 100)}% Complete
          </Text>
          <TouchableOpacity
            style={[
              styles.addWaterButton,
              waterIntake >= waterGoal && styles.addWaterButtonDisabled,
            ]}
            onPress={addWater}
            disabled={waterIntake >= waterGoal}
          >
            <Feather name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.addWaterText}>Add Glass</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BMI Calculator */}
      <View style={[styles.bmiCard, { backgroundColor: colors.card }]}>
        <View style={styles.bmiHeader}>
          <View
            style={[
              styles.bmiIconContainer,
              { backgroundColor: getBMIBgColor() },
            ]}
          >
            <Feather name="user" size={20} color={getBMIColor()} />
          </View>
          <View style={styles.bmiTitleContainer}>
            <Text style={[styles.bmiTitle, { color: colors.text }]}>
              BMI Calculator
            </Text>
            <Text style={[styles.bmiSubtitle, { color: colors.textSecondary }]}>
              Track your body mass index
            </Text>
          </View>
        </View>

        <View style={styles.bmiInputsContainer}>
          <View style={styles.bmiInputWrapper}>
            <Text
              style={[styles.bmiInputLabel, { color: colors.textSecondary }]}
            >
              Weight (kg)
            </Text>
            <TextInput
              style={[
                styles.bmiInput,
                {
                  backgroundColor: isDark ? "#374151" : "#F3F4F6",
                  color: colors.text,
                  borderColor: isDark ? "#4B5563" : "#E5E7EB",
                },
              ]}
              placeholder="70"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>

          <View style={styles.bmiInputWrapper}>
            <Text
              style={[styles.bmiInputLabel, { color: colors.textSecondary }]}
            >
              Height (cm)
            </Text>
            <TextInput
              style={[
                styles.bmiInput,
                {
                  backgroundColor: isDark ? "#374151" : "#F3F4F6",
                  color: colors.text,
                  borderColor: isDark ? "#4B5563" : "#E5E7EB",
                },
              ]}
              placeholder="170"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.calculateButton,
            { backgroundColor: colors.primary },
            (!weight || !height) && styles.calculateButtonDisabled,
          ]}
          onPress={handleCalculateBMI}
          disabled={!weight || !height}
        >
          <Text style={styles.calculateButtonText}>Calculate BMI</Text>
        </TouchableOpacity>

        {bmi !== null && (
          <View
            style={[styles.bmiResultCard, { backgroundColor: getBMIBgColor() }]}
          >
            <View style={styles.bmiResultRow}>
              <Text style={[styles.bmiResultLabel, { color: getBMIColor() }]}>
                Your BMI:
              </Text>
              <Text style={[styles.bmiResultValue, { color: getBMIColor() }]}>
                {bmi.toFixed(1)}
              </Text>
            </View>
            <View style={styles.bmiResultRow}>
              <Text style={[styles.bmiResultLabel, { color: getBMIColor() }]}>
                Category:
              </Text>
              <Text
                style={[styles.bmiResultCategory, { color: getBMIColor() }]}
              >
                {bmiCategory}
              </Text>
            </View>
            <View
              style={[
                styles.bmiAdviceContainer,
                { borderTopColor: getBMIColor() + "40" },
              ]}
            >
              <Text style={[styles.bmiAdvice, { color: getBMIColor() }]}>
                {getBMIAdvice()}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Diet Plan Button */}
      <TouchableOpacity
        style={[styles.dietButton, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate("DietPlanner")}
      >
        <View style={styles.dietButtonContent}>
          <View
            style={[
              styles.dietButtonIcon,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Feather name="calendar" size={28} color={colors.primary} />
          </View>
          <View style={styles.dietButtonText}>
            <Text style={[styles.dietButtonTitle, { color: colors.text }]}>
              Today's Diet Plan
            </Text>
            <Text
              style={[
                styles.dietButtonSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              View and customize your meals
            </Text>
          </View>
          <Feather
            name="chevron-right"
            size={24}
            color={colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: isDark ? "#1E3A8A" : "#EFF6FF",
            },
          ]}
        >
          <Feather name="activity" size={24} color="#2563EB" />
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? "#DBEAFE" : "#6B7280" },
            ]}
          >
            Total Exercises
          </Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {exercises.length}
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: isDark ? "#064E3B" : "#D1FAE5",
            },
          ]}
        >
          <Feather name="zap" size={24} color="#10B981" />
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? "#A7F3D0" : "#6B7280" },
            ]}
          >
            Calories Today
          </Text>
          <Text style={[styles.statValue, { color: colors.text }]}>450</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: "#6B7280",
  },
  favoritesIconButton: {
    position: "relative",
    padding: 8,
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  wellnessTipCard: {
    backgroundColor: "#FFFBEB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#78350F",
    lineHeight: 20,
  },
  waterCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  waterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  waterTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  waterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  waterProgress: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  waterProgressBar: {
    height: 8,
    backgroundColor: "#DBEAFE",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  waterProgressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 4,
  },
  waterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  waterPercentage: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  addWaterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  addWaterButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  addWaterText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  dietButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dietButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dietButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  dietButtonText: {
    flex: 1,
  },
  dietButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  dietButtonSubtitle: {
    fontSize: 13,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  // BMI Calculator Styles
  bmiCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bmiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  bmiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bmiTitleContainer: {
    flex: 1,
  },
  bmiTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  bmiSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  bmiInputsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  bmiInputWrapper: {
    flex: 1,
  },
  bmiInputLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 8,
  },
  bmiInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  calculateButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  calculateButtonDisabled: {
    opacity: 0.5,
  },
  calculateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  bmiResultCard: {
    borderRadius: 12,
    padding: 16,
  },
  bmiResultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bmiResultLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  bmiResultValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  bmiResultCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00000000",
  },
  bmiAdviceContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#00000000",
  },
  bmiAdvice: {
    fontSize: 12,
    lineHeight: 18,
    color: "#00000000",
  },
});
