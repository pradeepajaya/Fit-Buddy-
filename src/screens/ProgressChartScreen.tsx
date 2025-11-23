import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../contexts/ThemeContextRN";

const { width } = Dimensions.get("window");

interface WaterData {
  day: string;
  amount: number;
}

export function ProgressChartScreen() {
  const { colors } = useTheme();
  const [weeklyData] = useState([
    { day: "Mon", workouts: 2, calories: 450 },
    { day: "Tue", workouts: 1, calories: 300 },
    { day: "Wed", workouts: 3, calories: 600 },
    { day: "Thu", workouts: 2, calories: 500 },
    { day: "Fri", workouts: 1, calories: 250 },
    { day: "Sat", workouts: 4, calories: 800 },
    { day: "Sun", workouts: 2, calories: 400 },
  ]);

  const [weeklyWaterData, setWeeklyWaterData] = useState<WaterData[]>([]);
  const [totalWater, setTotalWater] = useState(0);

  useEffect(() => {
    loadWaterData();
  }, []);

  const loadWaterData = async () => {
    try {
      const waterHistory = await AsyncStorage.getItem("waterHistory");
      if (waterHistory) {
        const history = JSON.parse(waterHistory);
        const water = history.reduce(
          (sum: number, item: any) => sum + item.amount,
          0
        );
        setTotalWater(water);

        // Load last 7 days water data for graph
        const last7Days = getLast7DaysWaterData(history);
        setWeeklyWaterData(last7Days);
      } else {
        // Use mock data if no history
        const mockWaterData = [
          { day: "Mon", amount: 1800 },
          { day: "Tue", amount: 2200 },
          { day: "Wed", amount: 1900 },
          { day: "Thu", amount: 2100 },
          { day: "Fri", amount: 2000 },
          { day: "Sat", amount: 1700 },
          { day: "Sun", amount: 2300 },
        ];
        setWeeklyWaterData(mockWaterData);
      }
    } catch (error) {
      console.error("Error loading water data:", error);
    }
  };

  const getLast7DaysWaterData = (history: any[]): WaterData[] => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7Days: WaterData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayName = days[date.getDay()];

      const dayData = history.find((item: any) => item.date === dateStr);
      last7Days.push({
        day: dayName,
        amount: dayData ? dayData.amount : 0,
      });
    }

    return last7Days;
  };

  const totalWorkouts = weeklyData.reduce((sum, day) => sum + day.workouts, 0);
  const totalCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0);
  const avgWorkouts = (totalWorkouts / 7).toFixed(1);

  const maxWorkouts = Math.max(...weeklyData.map((d) => d.workouts));
  const maxCalories = Math.max(...weeklyData.map((d) => d.calories));

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Progress Tracking
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your weekly fitness summary
        </Text>
      </View>

      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={styles.statIcon}>
            <Feather name="activity" size={24} color="#2563EB" />
          </View>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {totalWorkouts}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total Workouts
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={styles.statIcon}>
            <Feather name="zap" size={24} color="#F59E0B" />
          </View>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {totalCalories}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Calories Burned
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={styles.statIcon}>
            <Feather name="trending-up" size={24} color="#10B981" />
          </View>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {avgWorkouts}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Avg/Day
          </Text>
        </View>
      </View>

      {/* Workout Chart */}
      <View style={[styles.chartSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Weekly Workouts
        </Text>
        <View style={styles.chart}>
          {weeklyData.map((day, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barColumn}>
                <Text style={[styles.barValue, { color: colors.text }]}>
                  {day.workouts}
                </Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (day.workouts / maxWorkouts) * 120,
                      backgroundColor: "#2563EB",
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                {day.day}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Calories Chart */}
      <View style={[styles.chartSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Calories Burned
        </Text>
        <View style={styles.chart}>
          {weeklyData.map((day, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barColumn}>
                <Text style={[styles.barValue, { color: colors.text }]}>
                  {day.calories}
                </Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (day.calories / maxCalories) * 120,
                      backgroundColor: "#F59E0B",
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                {day.day}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Water Intake Progress */}
      <View style={[styles.chartSection, { backgroundColor: colors.card }]}>
        <View style={styles.waterHeader}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Water Intake Progress
          </Text>
          <View style={styles.goalBadge}>
            <Feather name="droplet" size={14} color="#3b82f6" />
            <Text style={styles.goalText}>Goal: 2L/day</Text>
          </View>
        </View>
        <View style={styles.waterChart}>
          {weeklyWaterData.length > 0 ? (
            weeklyWaterData.map((data, index) => {
              const maxWaterIntake = 2500; // 2.5L max for scaling
              const percentage = Math.min(
                (data.amount / maxWaterIntake) * 100,
                100
              );
              const isGoalMet = data.amount >= 2000;

              return (
                <View key={index} style={styles.waterColumn}>
                  <View style={styles.waterBarContainer}>
                    <Text
                      style={[
                        styles.waterAmount,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {(data.amount / 1000).toFixed(1)}L
                    </Text>
                    <LinearGradient
                      colors={
                        isGoalMet
                          ? ["#10b981", "#059669"]
                          : ["#3b82f6", "#2563eb"]
                      }
                      style={[styles.waterBar, { height: `${percentage}%` }]}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                    >
                      {isGoalMet && (
                        <Feather
                          name="check-circle"
                          size={16}
                          color="#ffffff"
                        />
                      )}
                    </LinearGradient>
                  </View>
                  <Text
                    style={[
                      styles.waterDayLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {data.day}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
              No water intake data yet
            </Text>
          )}
        </View>
        <View style={[styles.waterLegend, { borderTopColor: colors.border }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#3b82f6" }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Below Goal
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#10b981" }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Goal Met ✓
            </Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Achievements
        </Text>
        <View
          style={[styles.achievementCard, { backgroundColor: colors.card }]}
        >
          <View style={styles.achievementIcon}>
            <Feather name="award" size={32} color="#F59E0B" />
          </View>
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementTitle, { color: colors.text }]}>
              7-Day Streak
            </Text>
            <Text
              style={[styles.achievementDesc, { color: colors.textSecondary }]}
            >
              Worked out every day this week!
            </Text>
          </View>
        </View>
        <View
          style={[styles.achievementCard, { backgroundColor: colors.card }]}
        >
          <View style={styles.achievementIcon}>
            <Feather name="target" size={32} color="#10B981" />
          </View>
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementTitle, { color: colors.text }]}>
              Calorie Goal
            </Text>
            <Text
              style={[styles.achievementDesc, { color: colors.textSecondary }]}
            >
              Burned 3,300 calories this week
            </Text>
          </View>
        </View>
        <View
          style={[styles.achievementCard, { backgroundColor: colors.card }]}
        >
          <View style={styles.achievementIcon}>
            <Feather name="star" size={32} color="#2563EB" />
          </View>
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementTitle, { color: colors.text }]}>
              Consistency King
            </Text>
            <Text
              style={[styles.achievementDesc, { color: colors.textSecondary }]}
            >
              15 workouts completed this month
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
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
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
  chartSection: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
    paddingTop: 30,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
  },
  barColumn: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 120,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    marginTop: 4,
  },
  barValue: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 8,
  },
  achievementsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  achievementCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
    justifyContent: "center",
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    color: "#6B7280",
  },
  waterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  goalBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  goalText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "600",
  },
  waterChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 180,
    paddingVertical: 12,
  },
  waterColumn: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  waterBarContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  waterBar: {
    width: 24,
    minHeight: 8,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  waterAmount: {
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 4,
  },
  waterDayLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  waterLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 14,
    paddingVertical: 40,
  },
});
