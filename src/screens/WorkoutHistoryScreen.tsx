import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContextRN";

interface WorkoutEntry {
  id: string;
  exerciseName: string;
  date: string;
  duration: number;
  calories: number;
  photo?: string;
  mood?: string;
  notes?: string;
}

export function WorkoutHistoryScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [history, setHistory] = useState<WorkoutEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "week" | "month">("all");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem("exerciseHistory");
      if (stored) {
        const allHistory: WorkoutEntry[] = JSON.parse(stored);
        setHistory(
          allHistory.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const getFilteredHistory = () => {
    const now = new Date();
    switch (filter) {
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return history.filter((h) => new Date(h.date) >= weekAgo);
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return history.filter((h) => new Date(h.date) >= monthAgo);
      default:
        return history;
    }
  };

  const filteredHistory = getFilteredHistory();
  const totalCalories = filteredHistory.reduce((sum, h) => sum + h.calories, 0);
  const totalDuration = filteredHistory.reduce((sum, h) => sum + h.duration, 0);

  const getMoodEmoji = (mood?: string) => {
    const moodMap: Record<string, string> = {
      energized: "💪",
      happy: "😊",
      fire: "🔥",
      relaxed: "😌",
      tired: "😅",
      motivated: "🤩",
      determined: "😤",
      accomplished: "🎉",
    };
    return mood ? moodMap[mood] || "😊" : "";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout History</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {["all", "week", "month"].map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterTab,
                {
                  backgroundColor: filter === f ? colors.primary : colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setFilter(f as any)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === f ? "#FFFFFF" : colors.text },
                ]}
              >
                {f === "all"
                  ? "All Time"
                  : f === "week"
                  ? "This Week"
                  : "This Month"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Feather name="activity" size={24} color="#2563EB" />
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {filteredHistory.length}
            </Text>
            <Text
              style={[styles.summaryLabel, { color: colors.textSecondary }]}
            >
              Workouts
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Feather name="clock" size={24} color="#10B981" />
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {totalDuration}
            </Text>
            <Text
              style={[styles.summaryLabel, { color: colors.textSecondary }]}
            >
              Minutes
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Feather name="zap" size={24} color="#F59E0B" />
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {totalCalories}
            </Text>
            <Text
              style={[styles.summaryLabel, { color: colors.textSecondary }]}
            >
              Calories
            </Text>
          </View>
        </View>

        {/* History List */}
        <View style={styles.historyContainer}>
          {filteredHistory.length > 0 ? (
            filteredHistory.map((entry) => (
              <View
                key={entry.id}
                style={[styles.historyCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.historyHeader}>
                  <View style={styles.historyTitleRow}>
                    <Feather name="check-circle" size={20} color="#10B981" />
                    <Text style={[styles.historyTitle, { color: colors.text }]}>
                      {entry.exerciseName}
                    </Text>
                  </View>
                  {entry.mood && (
                    <Text style={styles.moodEmoji}>
                      {getMoodEmoji(entry.mood)}
                    </Text>
                  )}
                </View>

                <View style={styles.historyDetails}>
                  <View style={styles.detailRow}>
                    <Feather
                      name="calendar"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.detailText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {new Date(entry.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Feather
                      name="clock"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.detailText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {entry.duration} min
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Feather
                      name="zap"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.detailText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {entry.calories} kcal
                    </Text>
                  </View>
                </View>

                {entry.notes && (
                  <View style={styles.notesSection}>
                    <Text style={[styles.notesText, { color: colors.text }]}>
                      "{entry.notes}"
                    </Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No workout history yet
              </Text>
            </View>
          )}
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
  filterContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  summaryContainer: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  summaryCard: {
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
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  historyContainer: {
    padding: 16,
    paddingTop: 8,
  },
  historyCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  moodEmoji: {
    fontSize: 24,
  },
  historyDetails: {
    flexDirection: "row",
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
  },
  notesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  notesText: {
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});
