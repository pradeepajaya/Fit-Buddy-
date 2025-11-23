import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContextRN";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { clearSelectedExercise } from "../store/exercisesSlice";
import { toggleFavorite } from "../store/favoritesSlice";
import { ExerciseTimer } from "../components/ExerciseTimer";

export function ExerciseDetailScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const exercise = useAppSelector((state) => state.exercises.selectedExercise);
  const favorites = useAppSelector((state) => state.favorites.items);

  const isFavorite = exercise
    ? favorites.some((fav) => fav.name === exercise.name)
    : false;

  if (!exercise) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Exercise Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Feather name="alert-circle" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No exercise selected
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Please select an exercise from the tracker
          </Text>
        </View>
      </View>
    );
  }

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(exercise));
  };

  const handleBack = () => {
    dispatch(clearSelectedExercise());
    navigation.goBack();
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

  const getDefaultDuration = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return 20;
      case "intermediate":
        return 30;
      case "advanced":
        return 45;
      default:
        return 30;
    }
  };

  const getExerciseGif = (exerciseName: string) => {
    // Generate exercise GIF URL from exercise name
    const searchName = exerciseName.toLowerCase().replace(/\s+/g, "-");
    return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${searchName}/images/0.jpg`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={handleBack}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Details</Text>
        <TouchableOpacity onPress={handleToggleFavorite}>
          <Feather
            name={isFavorite ? "heart" : "heart"}
            size={24}
            color={isFavorite ? "#EF4444" : "#FFFFFF"}
            fill={isFavorite ? "#EF4444" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseCategory}>
              {exercise.muscle} · {exercise.type}
            </Text>
          </View>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(exercise.difficulty) },
            ]}
          >
            <Text style={styles.difficultyText}>
              {exercise.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Exercise GIF/Image */}
        <View style={[styles.gifContainer, { backgroundColor: colors.card }]}>
          <Image
            source={{ uri: getExerciseGif(exercise.name) }}
            style={styles.exerciseGif}
            resizeMode="cover"
          />
          <View style={styles.gifOverlay}>
            <Feather
              name="play-circle"
              size={48}
              color="rgba(255,255,255,0.9)"
            />
          </View>
        </View>

        {/* Exercise Timer */}
        <ExerciseTimer
          exerciseName={exercise.name}
          duration={getDefaultDuration(exercise.difficulty)}
          onComplete={() => {
            // Handle completion - could track workout history here
          }}
        />

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
            <View style={[styles.iconCircle, { backgroundColor: "#DBEAFE" }]}>
              <Feather name="target" size={20} color="#2563EB" />
            </View>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Muscle
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {exercise.muscle}
            </Text>
          </View>

          <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
            <View style={[styles.iconCircle, { backgroundColor: "#D1FAE5" }]}>
              <Feather name="activity" size={20} color="#10B981" />
            </View>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Type
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {exercise.type}
            </Text>
          </View>

          <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
            <View style={[styles.iconCircle, { backgroundColor: "#FEF3C7" }]}>
              <Feather name="tool" size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Equipment
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {exercise.equipment}
            </Text>
          </View>

          <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
            <View style={[styles.iconCircle, { backgroundColor: "#FEE2E2" }]}>
              <Feather name="bar-chart-2" size={20} color="#EF4444" />
            </View>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Difficulty
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {exercise.difficulty}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View
          style={[styles.instructionsCard, { backgroundColor: colors.card }]}
        >
          <View style={styles.instructionsHeader}>
            <Feather name="book-open" size={20} color={colors.primary} />
            <Text style={[styles.instructionsTitle, { color: colors.text }]}>
              Instructions
            </Text>
          </View>
          <Text style={[styles.instructionsText, { color: colors.text }]}>
            {exercise.instructions}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
          >
            <Feather name="play-circle" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Start Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.outlineButton,
              { borderColor: colors.border },
            ]}
          >
            <Feather name="bookmark" size={20} color={colors.text} />
            <Text style={[styles.outlineButtonText, { color: colors.text }]}>
              Save for Later
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  heroSection: {
    backgroundColor: "#2563EB",
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  gifContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    height: 250,
    position: "relative",
  },
  exerciseGif: {
    width: "100%",
    height: "100%",
  },
  gifOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  heroContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  exerciseCategory: {
    fontSize: 16,
    color: "#DBEAFE",
    textTransform: "capitalize",
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  detailCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
    textAlign: "center",
  },
  instructionsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  instructionsText: {
    fontSize: 15,
    lineHeight: 24,
  },
  actionButtons: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
