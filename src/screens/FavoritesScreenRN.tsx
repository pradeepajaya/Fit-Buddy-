import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { toggleFavorite } from "../store/favoritesSlice";

export function FavoritesScreenRN() {
  const favorites = useAppSelector((state) => state.favorites.items);
  const dispatch = useAppDispatch();

  const handleRemoveFavorite = (exercise: any) => {
    dispatch(toggleFavorite(exercise));
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

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="heart" size={64} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptyText}>
          Start adding exercises to your favorites to access them quickly
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Feather name="heart" size={20} color="#EF4444" />
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{favorites.length}</Text>
        </View>
        <View style={styles.statCard}>
          <Feather name="activity" size={20} color="#10B981" />
          <Text style={styles.statLabel}>Cardio</Text>
          <Text style={styles.statValue}>
            {favorites.filter((ex) => ex.type === "cardio").length}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Feather name="target" size={20} color="#F97316" />
          <Text style={styles.statLabel}>Strength</Text>
          <Text style={styles.statValue}>
            {favorites.filter((ex) => ex.type === "strength").length}
          </Text>
        </View>
      </View>

      {favorites.map((exercise, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardLeft}>
              <View
                style={[
                  styles.icon,
                  exercise.type === "cardio"
                    ? styles.cardioIcon
                    : styles.strengthIcon,
                ]}
              >
                <Feather
                  name={exercise.type === "cardio" ? "activity" : "target"}
                  size={20}
                  color={exercise.type === "cardio" ? "#10B981" : "#F97316"}
                />
              </View>
              <View>
                <Text style={styles.cardTitle}>{exercise.name}</Text>
                <Text style={styles.cardSubtitle}>{exercise.muscle}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleRemoveFavorite(exercise)}>
              <Feather name="heart" size={24} color="#EF4444" fill="#EF4444" />
            </TouchableOpacity>
          </View>

          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    getDifficultyColor(exercise.difficulty) + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: getDifficultyColor(exercise.difficulty) },
                ]}
              >
                {exercise.difficulty}
              </Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {exercise.instructions}
          </Text>

          <TouchableOpacity style={styles.button}>
            <Feather name="play" size={16} color="#FFFFFF" />
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      ))}
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#F9FAFB",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardioIcon: {
    backgroundColor: "#D1FAE5",
  },
  strengthIcon: {
    backgroundColor: "#FED7AA",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textTransform: "capitalize",
  },
  badgeContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});
