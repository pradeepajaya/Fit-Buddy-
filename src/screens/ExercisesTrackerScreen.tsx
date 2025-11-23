import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
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
