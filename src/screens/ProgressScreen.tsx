import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../contexts/ThemeContextRN";

const { width } = Dimensions.get("window");

interface WeeklyData {
  day: string;
  water: number;
  exercise: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  gradient: string[];
}

const ProgressScreen = () => {
  const { colors, isDark } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">(
    "week"
  );
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalWater, setTotalWater] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [weeklyWaterData, setWeeklyWaterData] = useState<WeeklyData[]>([]);

  // Mock weekly data
  const weeklyData: WeeklyData[] = [
    { day: "Mon", water: 1800, exercise: 250 },
    { day: "Tue", water: 2200, exercise: 300 },
    { day: "Wed", water: 1900, exercise: 0 },
    { day: "Thu", water: 2100, exercise: 350 },
    { day: "Fri", water: 2000, exercise: 400 },
    { day: "Sat", water: 1700, exercise: 500 },
    { day: "Sun", water: 2300, exercise: 200 },
  ];

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Hydration Hero",
      description: "Drink water for 7 days straight",
      icon: "droplet",
      unlocked: true,
      progress: 7,
      target: 7,
      gradient: ["#3b82f6", "#06b6d4"],
    },
    {
      id: "2",
      title: "Workout Warrior",
      description: "Complete 10 workouts",
      icon: "activity",
      unlocked: false,
      progress: 6,
      target: 10,
      gradient: ["#f97316", "#ef4444"],
    },
    {
      id: "3",
      title: "Streak Master",
      description: "Maintain a 30-day streak",
      icon: "zap",
      unlocked: false,
      progress: 12,
      target: 30,
      gradient: ["#ef4444", "#dc2626"],
    },
    {
      id: "4",
      title: "Calorie Crusher",
      description: "Burn 5000 total calories",
      icon: "trending-up",
      unlocked: false,
      progress: 3200,
      target: 5000,
      gradient: ["#10b981", "#059669"],
    },
    {
      id: "5",
      title: "Early Bird",
      description: "Complete 5 morning workouts",
      icon: "sun",
      unlocked: true,
      progress: 5,
      target: 5,
      gradient: ["#f59e0b", "#d97706"],
    },
    {
      id: "6",
      title: "Consistency King",
      description: "Log activity every day for a month",
      icon: "check-circle",
      unlocked: false,
      progress: 15,
      target: 30,
      gradient: ["#8b5cf6", "#7c3aed"],
    },
  ];

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const exerciseHistory = await AsyncStorage.getItem("exerciseHistory");
      if (exerciseHistory) {
        const history = JSON.parse(exerciseHistory);
        setTotalWorkouts(history.length);
        const calories = history.reduce(
          (sum: number, item: any) => sum + item.calories,
          0
        );
        setTotalCalories(calories);
      }

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
        setWeeklyWaterData(weeklyData);
      }

      // Calculate streak (mock for now)
      setCurrentStreak(12);
    } catch (error) {
      console.error("Error loading progress data:", error);
    }
  };

  const getLast7DaysWaterData = (history: any[]): WeeklyData[] => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7Days: WeeklyData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayName = days[date.getDay()];

      const dayData = history.find((item: any) => item.date === dateStr);
      last7Days.push({
        day: dayName,
        water: dayData ? dayData.amount : 0,
        exercise: 0, // Not used in water graph
      });
    }

    return last7Days;
  };

  const maxWater = Math.max(...weeklyData.map((d) => d.water));
  const maxExercise = Math.max(...weeklyData.map((d) => d.exercise));

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Your Progress</Text>
            <Text style={styles.subtitle}>Track your fitness journey</Text>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Feather name="share-2" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={["#3b82f6", "#8b5cf6"]}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIconContainer}>
              <Feather name="activity" size={28} color="#ffffff" />
            </View>
            <Text style={styles.statValue}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#f97316", "#ef4444"]}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIconContainer}>
              <Feather name="zap" size={28} color="#ffffff" />
            </View>
            <Text style={styles.statValue}>{totalCalories}</Text>
            <Text style={styles.statLabel}>Calories Burned</Text>
          </LinearGradient>
        </View>

        <View style={styles.statsContainer}>
          <LinearGradient
            colors={["#10b981", "#059669"]}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIconContainer}>
              <Feather name="droplet" size={28} color="#ffffff" />
            </View>
            <Text style={styles.statValue}>
              {(totalWater / 1000).toFixed(1)}L
            </Text>
            <Text style={styles.statLabel}>Water Consumed</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#f59e0b", "#d97706"]}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIconContainer}>
              <Feather name="calendar" size={28} color="#ffffff" />
            </View>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak 🔥</Text>
          </LinearGradient>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "week" && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod("week")}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === "week" && styles.periodTextActive,
              ]}
            >
              This Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "month" && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod("month")}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === "month" && styles.periodTextActive,
              ]}
            >
              This Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Activity Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#3b82f6" }]}
                />
                <Text style={styles.legendText}>Water (ml)</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#f97316" }]}
                />
                <Text style={styles.legendText}>Exercise (cal)</Text>
              </View>
            </View>

            <View style={styles.chart}>
              {weeklyData.map((data, index) => (
                <View key={index} style={styles.chartColumn}>
                  <View style={styles.chartBars}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: `${(data.water / maxWater) * 100}%`,
                          backgroundColor: "#3b82f6",
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: `${(data.exercise / maxExercise) * 100}%`,
                          backgroundColor: "#f97316",
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{data.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Water Intake Graph */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Water Intake Progress</Text>
            <View style={styles.goalBadge}>
              <Feather name="droplet" size={14} color="#3b82f6" />
              <Text style={styles.goalText}>Goal: 2L/day</Text>
            </View>
          </View>
          <View style={styles.chartCard}>
            <View style={styles.waterChart}>
              {weeklyWaterData.length > 0 ? (
                weeklyWaterData.map((data, index) => {
                  const maxWaterIntake = 2500; // 2.5L max for scaling
                  const percentage = Math.min(
                    (data.water / maxWaterIntake) * 100,
                    100
                  );
                  const isGoalMet = data.water >= 2000;

                  return (
                    <View key={index} style={styles.waterColumn}>
                      <View style={styles.waterBarContainer}>
                        <Text style={styles.waterAmount}>
                          {(data.water / 1000).toFixed(1)}L
                        </Text>
                        <LinearGradient
                          colors={
                            isGoalMet
                              ? ["#10b981", "#059669"]
                              : ["#3b82f6", "#2563eb"]
                          }
                          style={[
                            styles.waterBar,
                            { height: `${percentage}%` },
                          ]}
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
                      <Text style={styles.waterDayLabel}>{data.day}</Text>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.noDataText}>No water intake data yet</Text>
              )}
            </View>
            <View style={styles.waterLegend}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#3b82f6" }]}
                />
                <Text style={styles.legendText}>Below Goal</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#10b981" }]}
                />
                <Text style={styles.legendText}>Goal Met ✓</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <LinearGradient
                  colors={
                    achievement.unlocked
                      ? (achievement.gradient as any)
                      : (["#6b7280", "#4b5563"] as any)
                  }
                  style={styles.achievementGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.achievementIcon}>
                    <Feather
                      name={achievement.icon as any}
                      size={32}
                      color="#ffffff"
                      style={{ opacity: achievement.unlocked ? 1 : 0.5 }}
                    />
                  </View>
                  {achievement.unlocked && (
                    <View style={styles.unlockedBadge}>
                      <Feather name="check-circle" size={20} color="#10b981" />
                    </View>
                  )}
                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${
                              (achievement.progress / achievement.target) * 100
                            }%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {achievement.progress}/{achievement.target}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    shareButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    statsContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      marginBottom: 12,
      gap: 12,
    },
    statCard: {
      flex: 1,
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    statIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    statValue: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: "rgba(255, 255, 255, 0.9)",
      textAlign: "center",
    },
    periodSelector: {
      flexDirection: "row",
      marginHorizontal: 20,
      marginBottom: 20,
      marginTop: 8,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: "center",
    },
    periodButtonActive: {
      backgroundColor: colors.primary,
    },
    periodText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    periodTextActive: {
      color: "#ffffff",
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    chartCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chartLegend: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 20,
      marginBottom: 20,
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
      color: colors.textSecondary,
    },
    chart: {
      flexDirection: "row",
      justifyContent: "space-between",
      height: 180,
      alignItems: "flex-end",
    },
    chartColumn: {
      flex: 1,
      alignItems: "center",
      gap: 8,
    },
    chartBars: {
      flexDirection: "row",
      alignItems: "flex-end",
      height: 150,
      gap: 2,
    },
    chartBar: {
      width: 12,
      minHeight: 4,
      borderRadius: 6,
    },
    chartLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    achievementsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    achievementCard: {
      width: (width - 52) / 2,
      borderRadius: 16,
      overflow: "hidden",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    achievementGradient: {
      padding: 16,
      alignItems: "center",
    },
    achievementIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    unlockedBadge: {
      position: "absolute",
      top: 8,
      right: 8,
      backgroundColor: "#ffffff",
      borderRadius: 12,
    },
    achievementTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#ffffff",
      textAlign: "center",
      marginBottom: 4,
    },
    achievementDescription: {
      fontSize: 11,
      color: "rgba(255, 255, 255, 0.8)",
      textAlign: "center",
      marginBottom: 12,
    },
    progressContainer: {
      width: "100%",
      marginTop: 4,
    },
    progressBar: {
      height: 6,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderRadius: 3,
      overflow: "hidden",
      marginBottom: 4,
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#ffffff",
      borderRadius: 3,
    },
    progressText: {
      fontSize: 10,
      color: "rgba(255, 255, 255, 0.9)",
      textAlign: "center",
      fontWeight: "600",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    goalBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#EFF6FF",
      paddingHorizontal: 12,
      paddingVertical: 6,
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
      height: 200,
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
      position: "relative",
    },
    waterBar: {
      width: 28,
      minHeight: 8,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    waterAmount: {
      fontSize: 10,
      color: colors.textSecondary,
      fontWeight: "600",
      marginBottom: 4,
    },
    waterDayLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    waterLegend: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 16,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    noDataText: {
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: 14,
      paddingVertical: 40,
    },
  });

export default ProgressScreen;
