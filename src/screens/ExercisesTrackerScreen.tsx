import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchExercises, setSelectedExercise } from "../store/exercisesSlice";
import { useTheme } from "../contexts/ThemeContextRN";

type FitnessGoal =
  | "burn_fat"
  | "build_muscle"
  | "toned_abs"
  | "arm_strength"
  | "leg_power"
  | "flexibility";

interface ExerciseHistory {
  id: string;
  exerciseName: string;
  date: string;
  duration: number;
  calories: number;
}

export function ExercisesTrackerScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { colors, isDark } = useTheme();
  const {
    items: exercises,
    loading,
    error,
  } = useAppSelector((state) => state.exercises);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal | null>(null);
  const [savedExercises, setSavedExercises] = useState<any[]>([]);
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showViewAll, setShowViewAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    name: string;
    muscleGroup: string;
    icon: string;
    color: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchExercises());
    loadFitnessGoal();
    loadSavedExercises();
    loadExerciseHistory();

    // Set header buttons
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 10 }}>
          <TouchableOpacity
            onPress={() => setShowHistory(true)}
            style={{ marginRight: 15, padding: 5 }}
          >
            <Feather name="clock" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowSaved(true)}
            style={{ padding: 5, position: "relative" }}
          >
            <Feather name="bookmark" size={24} color="#FFFFFF" />
            {savedExercises.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{savedExercises.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, savedExercises.length]);

  const loadFitnessGoal = async () => {
    try {
      const savedGoal = await AsyncStorage.getItem("fitnessGoal");
      if (savedGoal) {
        setFitnessGoal(savedGoal as FitnessGoal);
      }
    } catch (error) {
      console.error("Error loading fitness goal:", error);
    }
  };

  const loadSavedExercises = async () => {
    try {
      const saved = await AsyncStorage.getItem("savedExercisesRN");
      if (saved) {
        setSavedExercises(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading saved exercises:", error);
    }
  };

  const loadExerciseHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("exerciseHistoryRN");
      if (history) {
        setExerciseHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error("Error loading exercise history:", error);
    }
  };

  const fitnessGoals = [
    {
      id: "burn_fat" as FitnessGoal,
      name: "Burn Fat",
      icon: "🔥",
      color: "#ef4444",
      description: "High-intensity cardio exercises",
    },
    {
      id: "build_muscle" as FitnessGoal,
      name: "Build Muscle",
      icon: "💪",
      color: "#3b82f6",
      description: "Strength training exercises",
    },
    {
      id: "toned_abs" as FitnessGoal,
      name: "Toned Abs",
      icon: "🎯",
      color: "#8b5cf6",
      description: "Core-focused exercises",
    },
    {
      id: "arm_strength" as FitnessGoal,
      name: "Arm Strength",
      icon: "🏋️",
      color: "#06b6d4",
      description: "Upper body exercises",
    },
    {
      id: "leg_power" as FitnessGoal,
      name: "Leg Power",
      icon: "🦵",
      color: "#10b981",
      description: "Lower body exercises",
    },
    {
      id: "flexibility" as FitnessGoal,
      name: "Flexibility",
      icon: "🧘",
      color: "#f59e0b",
      description: "Stretching exercises",
    },
  ];

  const saveFitnessGoal = async (goal: FitnessGoal) => {
    try {
      await AsyncStorage.setItem("fitnessGoal", goal);
      setFitnessGoal(goal);
    } catch (error) {
      console.error("Error saving fitness goal:", error);
    }
  };

  const toggleSaveExercise = async (exercise: any) => {
    try {
      const isSaved = savedExercises.some((ex) => ex.id === exercise.id);
      let updated;

      if (isSaved) {
        updated = savedExercises.filter((ex) => ex.id !== exercise.id);
      } else {
        updated = [...savedExercises, exercise];
      }

      setSavedExercises(updated);
      await AsyncStorage.setItem("savedExercisesRN", JSON.stringify(updated));
    } catch (error) {
      console.error("Error toggling saved exercise:", error);
    }
  };

  const isExerciseSaved = (exerciseId: string) => {
    return savedExercises.some((ex) => ex.id === exerciseId);
  };

  const getExerciseImage = (exerciseName: string) => {
    // Map exercise names to local images in src/images/exercises folder
    const imageMap: { [key: string]: any } = {
      // Chest Exercises
      "push-ups": require("../images/exercises/push ups.jpg"),
      "push ups": require("../images/exercises/push ups.jpg"),
      "bench press": require("../images/exercises/bench-press.png"),
      "dumbbell flyes": require("../images/exercises/dumbbell-fly.jpg"),

      // Back Exercises
      "pull-ups": require("../images/exercises/Pull-ups.jpg"),
      "pull ups": require("../images/exercises/Pull-ups.jpg"),
      "bent-over rows": require("../images/exercises/bent-over-rows.png"),
      "bent over rows": require("../images/exercises/bent-over-rows.png"),
      deadlift: require("../images/exercises/deadlift.jpg"),

      // Leg Exercises
      squats: require("../images/exercises/squats.jpg"),
      lunges: require("../images/exercises/lunges.jpg"),
      "leg press": require("../images/exercises/leg press.jpg"),

      // Shoulder Exercises
      "shoulder press": require("../images/exercises/shoulder press.png"),
      "lateral raises": require("../images/exercises/lateral raises.jpg"),

      // Arm Exercises
      "bicep curls": require("../images/exercises/bicep curls.jpg"),
      "tricep dips": require("../images/exercises/tricep dips.jpg"),

      // Core Exercises
      plank: require("../images/exercises/plank.jpg"),
      crunches: require("../images/exercises/crunches.jpg"),
      "russian twists": require("../images/exercises/russian twist.jpg"),

      // Cardio Exercises
      "jump rope": require("../images/exercises/jumping rope.jpg"),
      burpees: require("../images/exercises/burpees.jpg"),

      // Flexibility/Mobility
      "yoga flow": require("../images/exercises/yoga flow.png"),
      "stretching routine": require("../images/exercises/stretching routine.jpg"),
    };

    // Normalize the exercise name: lowercase, replace hyphens with spaces
    const key = exerciseName.toLowerCase().trim().replace(/-/g, " ");

    // Try exact match first
    if (imageMap[key]) return imageMap[key];

    // Try with hyphens
    const keyWithHyphen = exerciseName.toLowerCase().trim();
    if (imageMap[keyWithHyphen]) return imageMap[keyWithHyphen];

    // Fallback to a default image
    return require("../images/exercises/push ups.jpg");
  };

  const getRecommendedExercises = () => {
    if (!fitnessGoal || exercises.length === 0) return [];

    switch (fitnessGoal) {
      case "burn_fat":
        return exercises
          .filter(
            (ex: any) =>
              ex.type === "cardio" ||
              ex.name.toLowerCase().includes("burpee") ||
              ex.name.toLowerCase().includes("jumping")
          )
          .slice(0, 4);
      case "build_muscle":
        return exercises
          .filter(
            (ex: any) => ex.type === "strength" && ex.difficulty !== "beginner"
          )
          .slice(0, 4);
      case "toned_abs":
        return exercises
          .filter(
            (ex: any) => ex.muscle === "abdominals" || ex.muscle === "obliques"
          )
          .slice(0, 4);
      case "arm_strength":
        return exercises
          .filter(
            (ex: any) =>
              ex.muscle === "biceps" ||
              ex.muscle === "triceps" ||
              ex.muscle === "chest"
          )
          .slice(0, 4);
      case "leg_power":
        return exercises
          .filter(
            (ex: any) => ex.muscle === "quadriceps" || ex.muscle === "glutes"
          )
          .slice(0, 4);
      case "flexibility":
        return exercises
          .filter((ex: any) => ex.type === "stretching")
          .slice(0, 4);
      default:
        return [];
    }
  };

  const getExercisesByMuscleGroup = (muscleGroup: string) => {
    return exercises.filter(
      (ex: any) => ex.muscle_group?.toLowerCase() === muscleGroup.toLowerCase()
    );
  };

  const exerciseCategories = [
    {
      name: "Chest Exercises",
      muscleGroup: "chest",
      icon: "💪",
      color: "#EF4444",
    },
    {
      name: "Back Exercises",
      muscleGroup: "back",
      icon: "🔙",
      color: "#3B82F6",
    },
    {
      name: "Leg Exercises",
      muscleGroup: "legs",
      icon: "🦵",
      color: "#10B981",
    },
    {
      name: "Shoulder Exercises",
      muscleGroup: "shoulders",
      icon: "🏋️",
      color: "#F59E0B",
    },
    {
      name: "Arm Exercises",
      muscleGroup: "arms",
      icon: "💪",
      color: "#8B5CF6",
    },
    {
      name: "Core Exercises",
      muscleGroup: "abs",
      icon: "🎯",
      color: "#EC4899",
    },
  ];

  const recommendedExercises = getRecommendedExercises();

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Error: {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Fitness Goals */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Select Your Fitness Goal
        </Text>
        <View style={styles.goalsGrid}>
          {fitnessGoals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                { backgroundColor: colors.card },
                fitnessGoal === goal.id && {
                  ...styles.goalCardSelected,
                  borderColor: goal.color,
                },
              ]}
              onPress={() => saveFitnessGoal(goal.id)}
            >
              <Text style={styles.goalIcon}>{goal.icon}</Text>
              <Text style={[styles.goalName, { color: colors.text }]}>
                {goal.name}
              </Text>
              <Text
                style={[
                  styles.goalDescription,
                  { color: colors.textSecondary },
                ]}
              >
                {goal.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recommended Exercises */}
      {fitnessGoal && recommendedExercises.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recommended Exercises
          </Text>
          {recommendedExercises.map((exercise: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={[styles.exerciseCard, { backgroundColor: colors.card }]}
              onPress={() => {
                dispatch(setSelectedExercise(exercise));
                navigation.navigate("ExerciseDetail");
              }}
            >
              <View style={styles.exerciseHeader}>
                <Text style={[styles.exerciseName, { color: colors.text }]}>
                  {exercise.name}
                </Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor:
                        exercise.difficulty === "beginner"
                          ? "#10b981"
                          : exercise.difficulty === "intermediate"
                          ? "#f59e0b"
                          : "#ef4444",
                    },
                  ]}
                >
                  <Text style={styles.difficultyText}>
                    {exercise.difficulty}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.exerciseDescription,
                  { color: colors.textSecondary },
                ]}
              >
                {exercise.description || "No description available"}
              </Text>
              <View style={styles.exerciseStats}>
                <Text
                  style={[styles.exerciseStat, { color: colors.textSecondary }]}
                >
                  ⏱️ {exercise.duration} min
                </Text>
                <Text
                  style={[styles.exerciseStat, { color: colors.textSecondary }]}
                >
                  🔥 {exercise.calories} cal
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  isExerciseSaved(exercise.id) && styles.saveButtonActive,
                ]}
                onPress={() => toggleSaveExercise(exercise)}
              >
                <Feather
                  name={isExerciseSaved(exercise.id) ? "bookmark" : "bookmark"}
                  size={16}
                  color={isExerciseSaved(exercise.id) ? "#FFFFFF" : "#2563EB"}
                />
                <Text
                  style={[
                    styles.saveButtonText,
                    isExerciseSaved(exercise.id) && styles.saveButtonTextActive,
                  ]}
                >
                  {isExerciseSaved(exercise.id) ? "Saved" : "Save"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* View All Exercises Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.viewAllExercisesButton,
            { backgroundColor: colors.primary },
          ]}
          onPress={() => setShowViewAll(true)}
        >
          <Feather name="grid" size={20} color="#FFFFFF" />
          <Text style={styles.viewAllExercisesText}>View All Exercises</Text>
          <View style={styles.exerciseCountBadge}>
            <Text style={styles.exerciseCountText}>{exercises.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* View All Exercises Modal */}
      <Modal
        visible={showViewAll}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowViewAll(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Feather name="grid" size={24} color={colors.text} />
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  All Exercises
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowViewAll(false)}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {exerciseCategories.map((category) => {
                const categoryExercises = getExercisesByMuscleGroup(
                  category.muscleGroup
                );
                if (categoryExercises.length === 0) return null;

                return (
                  <View key={category.muscleGroup} style={{ marginBottom: 24 }}>
                    <View style={styles.categoryHeaderContainer}>
                      <View style={styles.categoryHeader}>
                        <Text style={styles.categoryIcon}>{category.icon}</Text>
                        <Text
                          style={[styles.categoryTitle, { color: colors.text }]}
                        >
                          {category.name}
                        </Text>
                        <View
                          style={[
                            styles.categoryBadge,
                            { backgroundColor: category.color },
                          ]}
                        >
                          <Text style={styles.categoryBadgeText}>
                            {categoryExercises.length}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.viewAllButton,
                          { borderColor: category.color },
                        ]}
                        onPress={() => {
                          setSelectedCategory(category);
                          setShowCategoryModal(true);
                        }}
                      >
                        <Text
                          style={[
                            styles.viewAllText,
                            { color: category.color },
                          ]}
                        >
                          Expand
                        </Text>
                        <Feather
                          name="chevron-right"
                          size={16}
                          color={category.color}
                        />
                      </TouchableOpacity>
                    </View>
                    {categoryExercises
                      .slice(0, 3)
                      .map((exercise: any, index: number) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.exerciseCard,
                            {
                              backgroundColor: colors.background,
                              marginBottom: 8,
                            },
                          ]}
                          onPress={() => {
                            dispatch(setSelectedExercise(exercise));
                            setShowViewAll(false);
                            navigation.navigate("ExerciseDetail");
                          }}
                        >
                          <View style={styles.exerciseHeader}>
                            <Text
                              style={[
                                styles.exerciseName,
                                { color: colors.text },
                              ]}
                            >
                              {exercise.name}
                            </Text>
                            <View
                              style={[
                                styles.difficultyBadge,
                                {
                                  backgroundColor:
                                    exercise.difficulty === "beginner"
                                      ? "#10b981"
                                      : exercise.difficulty === "intermediate"
                                      ? "#f59e0b"
                                      : "#ef4444",
                                },
                              ]}
                            >
                              <Text style={styles.difficultyText}>
                                {exercise.difficulty}
                              </Text>
                            </View>
                          </View>
                          <Text
                            style={[
                              styles.exerciseDescription,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {exercise.description || "No description available"}
                          </Text>
                          <View style={styles.exerciseStats}>
                            <Text
                              style={[
                                styles.exerciseStat,
                                { color: colors.textSecondary },
                              ]}
                            >
                              ⏱️ {exercise.duration} min
                            </Text>
                            <Text
                              style={[
                                styles.exerciseStat,
                                { color: colors.textSecondary },
                              ]}
                            >
                              🔥 {exercise.calories} cal
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={[
                              styles.saveButton,
                              isExerciseSaved(exercise.id) &&
                                styles.saveButtonActive,
                            ]}
                            onPress={() => toggleSaveExercise(exercise)}
                          >
                            <Feather
                              name={
                                isExerciseSaved(exercise.id)
                                  ? "bookmark"
                                  : "bookmark"
                              }
                              size={16}
                              color={
                                isExerciseSaved(exercise.id)
                                  ? "#FFFFFF"
                                  : "#2563EB"
                              }
                            />
                            <Text
                              style={[
                                styles.saveButtonText,
                                isExerciseSaved(exercise.id) &&
                                  styles.saveButtonTextActive,
                              ]}
                            >
                              {isExerciseSaved(exercise.id) ? "Saved" : "Save"}
                            </Text>
                          </TouchableOpacity>
                        </TouchableOpacity>
                      ))}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Individual Category Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text style={styles.categoryIcon}>
                  {selectedCategory?.icon}
                </Text>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {selectedCategory?.name}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {selectedCategory &&
                getExercisesByMuscleGroup(selectedCategory.muscleGroup).map(
                  (exercise: any, index: number) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.exerciseCard,
                        {
                          backgroundColor: colors.background,
                          marginBottom: 12,
                        },
                      ]}
                      onPress={() => {
                        dispatch(setSelectedExercise(exercise));
                        setShowCategoryModal(false);
                        navigation.navigate("ExerciseDetail");
                      }}
                    >
                      <View style={styles.exerciseHeader}>
                        <Text
                          style={[styles.exerciseName, { color: colors.text }]}
                        >
                          {exercise.name}
                        </Text>
                        <View
                          style={[
                            styles.difficultyBadge,
                            {
                              backgroundColor:
                                exercise.difficulty === "beginner"
                                  ? "#10b981"
                                  : exercise.difficulty === "intermediate"
                                  ? "#f59e0b"
                                  : "#ef4444",
                            },
                          ]}
                        >
                          <Text style={styles.difficultyText}>
                            {exercise.difficulty}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.exerciseDescription,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {exercise.description || "No description available"}
                      </Text>
                      <View style={styles.exerciseStats}>
                        <Text
                          style={[
                            styles.exerciseStat,
                            { color: colors.textSecondary },
                          ]}
                        >
                          ⏱️ {exercise.duration} min
                        </Text>
                        <Text
                          style={[
                            styles.exerciseStat,
                            { color: colors.textSecondary },
                          ]}
                        >
                          🔥 {exercise.calories} cal
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.saveButton,
                          isExerciseSaved(exercise.id) &&
                            styles.saveButtonActive,
                        ]}
                        onPress={() => toggleSaveExercise(exercise)}
                      >
                        <Feather
                          name={
                            isExerciseSaved(exercise.id)
                              ? "bookmark"
                              : "bookmark"
                          }
                          size={16}
                          color={
                            isExerciseSaved(exercise.id) ? "#FFFFFF" : "#2563EB"
                          }
                        />
                        <Text
                          style={[
                            styles.saveButtonText,
                            isExerciseSaved(exercise.id) &&
                              styles.saveButtonTextActive,
                          ]}
                        >
                          {isExerciseSaved(exercise.id) ? "Saved" : "Save"}
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )
                )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* History Modal */}
      <Modal
        visible={showHistory}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Recent Exercises</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <Feather name="x" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {exerciseHistory.length === 0 ? (
                <Text style={styles.emptyText}>No exercise history yet</Text>
              ) : (
                exerciseHistory.map((item) => (
                  <View key={item.id} style={styles.historyCard}>
                    <View>
                      <Text style={styles.historyName}>
                        {item.exerciseName}
                      </Text>
                      <Text style={styles.historyDate}>{item.date}</Text>
                    </View>
                    <View style={styles.historyStats}>
                      <Text style={styles.historyStat}>
                        {item.duration} min
                      </Text>
                      <Text style={styles.historyStat}>
                        {item.calories} cal
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Saved Exercises Modal */}
      <Modal
        visible={showSaved}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSaved(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Saved Exercises</Text>
              <TouchableOpacity onPress={() => setShowSaved(false)}>
                <Feather name="x" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {savedExercises.length === 0 ? (
                <Text style={styles.emptyText}>No saved exercises yet</Text>
              ) : (
                savedExercises.map((exercise) => (
                  <View key={exercise.id} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeader}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <View
                        style={[
                          styles.difficultyBadge,
                          {
                            backgroundColor:
                              exercise.difficulty === "beginner"
                                ? "#10b981"
                                : exercise.difficulty === "intermediate"
                                ? "#f59e0b"
                                : "#ef4444",
                          },
                        ]}
                      >
                        <Text style={styles.difficultyText}>
                          {exercise.difficulty}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.exerciseDescription}>
                      {exercise.description}
                    </Text>
                    <View style={styles.exerciseStats}>
                      <Text style={styles.exerciseStat}>
                        ⏱️ {exercise.duration} min
                      </Text>
                      <Text style={styles.exerciseStat}>
                        🔥 {exercise.calories} cal
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.saveButton, styles.saveButtonActive]}
                      onPress={() => toggleSaveExercise(exercise)}
                    >
                      <Feather name="bookmark" size={16} color="#FFFFFF" />
                      <Text style={styles.saveButtonTextActive}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  categoryHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
  },
  viewAllExercisesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewAllExercisesText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  exerciseCountBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  exerciseCountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  goalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  goalCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  goalCardSelected: {
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  goalName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  exerciseCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  exerciseDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  exerciseStats: {
    flexDirection: "row",
    gap: 16,
  },
  exerciseStat: {
    fontSize: 12,
    color: "#6b7280",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  saveButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  saveButtonText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButtonTextActive: {
    color: "#ffffff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  modalScroll: {
    maxHeight: "100%",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
    marginTop: 40,
  },
  historyCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  historyStats: {
    alignItems: "flex-end",
  },
  historyStat: {
    fontSize: 12,
    color: "#6b7280",
  },
});
