import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContextRN";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { removeFavorite } from "../store/favoritesSlice";

export function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  const handleRemoveFavorite = (exercise: any) => {
    dispatch(removeFavorite(exercise.name));
  };

  const cardioCount = favorites.filter((ex) => ex.type === "cardio").length;
  const strengthCount = favorites.filter((ex) => ex.type === "strength").length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>My Favorites</Text>
        <View style={styles.placeholder} />
      </View>

      {favorites.length > 0 ? (
        <>
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Feather name="heart" size={24} color="#EF4444" />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {favorites.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total Favorites
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Feather name="activity" size={24} color="#10B981" />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {cardioCount}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Cardio
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Feather name="trending-up" size={24} color="#F59E0B" />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {strengthCount}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Strength
              </Text>
            </View>
          </View>

          {/* Favorites List */}
          <View style={styles.listContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your Favorite Exercises
            </Text>
            {favorites.map((exercise, index) => (
              <View
                key={index}
                style={[styles.exerciseCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.exerciseHeader}>
                  <View
                    style={[
                      styles.exerciseIcon,
                      exercise.type === "cardio"
                        ? styles.cardioIcon
                        : styles.strengthIcon,
                    ]}
                  >
                    <Feather
                      name={
                        exercise.type === "cardio" ? "activity" : "trending-up"
                      }
                      size={24}
                      color={exercise.type === "cardio" ? "#10B981" : "#F59E0B"}
                    />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={[styles.exerciseName, { color: colors.text }]}>
                      {exercise.name}
                    </Text>
                    <Text
                      style={[
                        styles.exerciseMuscle,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {exercise.muscle}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveFavorite(exercise)}
                    style={styles.removeButton}
                  >
                    <Feather name="x" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                <View style={styles.exerciseDetails}>
                  <View style={styles.detailItem}>
                    <Feather name="package" size={14} color="#6B7280" />
                    <Text
                      style={[
                        styles.detailText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {exercise.equipment.replace("_", " ")}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.difficultyBadge,
                      {
                        backgroundColor:
                          exercise.difficulty === "beginner"
                            ? "#10B981"
                            : exercise.difficulty === "intermediate"
                            ? "#F59E0B"
                            : "#EF4444",
                      },
                    ]}
                  >
                    <Text style={styles.difficultyText}>
                      {exercise.difficulty}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Feather name="heart" size={64} color="#D1D5DB" />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Favorites Yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Start adding exercises to your favorites to see them here!
          </Text>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("ExercisesTracker")}
          >
            <Text style={styles.browseButtonText}>Browse Exercises</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 32,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cardioIcon: {
    backgroundColor: "#D1FAE5",
  },
  strengthIcon: {
    backgroundColor: "#FEF3C7",
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  exerciseMuscle: {
    fontSize: 14,
    color: "#6B7280",
    textTransform: "capitalize",
  },
  removeButton: {
    padding: 8,
  },
  exerciseDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: "#6B7280",
    textTransform: "capitalize",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
