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
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../contexts/ThemeContext";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const { theme } = useTheme();
  const [userName, setUserName] = useState("Friend");
  const [waterGoal, setWaterGoal] = useState(2000);
  const [waterConsumed, setWaterConsumed] = useState(1200);
  const [lastCalories, setLastCalories] = useState(250);
  const [dailyTip, setDailyTip] = useState("");

  const tips = [
    "Stay hydrated! Drink at least 8 glasses of water daily.",
    "Aim for 30 minutes of exercise daily for optimal health.",
    "Get 7-9 hours of quality sleep each night.",
    "Include protein in every meal to support muscle recovery.",
    "Take short walking breaks every hour if you sit for long periods.",
  ];

  useEffect(() => {
    loadData();
    setDailyTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const loadData = async () => {
    try {
      const profile = await AsyncStorage.getItem("userProfile");
      if (profile) {
        const data = JSON.parse(profile);
        setUserName(data.name || "Friend");
      }

      const waterHistory = await AsyncStorage.getItem("waterHistory");
      if (waterHistory) {
        const history = JSON.parse(waterHistory);
        const today = new Date().toDateString();
        const todayData = history.find((item: any) => item.date === today);
        if (todayData) {
          setWaterConsumed(todayData.amount);
        }
      }

      const exerciseHistory = await AsyncStorage.getItem("exerciseHistory");
      if (exerciseHistory) {
        const history = JSON.parse(exerciseHistory);
        if (history.length > 0) {
          setLastCalories(history[0].calories);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const waterPercentage = (waterConsumed / waterGoal) * 100;

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Day! 👋</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Daily Tip */}
        <LinearGradient
          colors={["#3b82f6", "#8b5cf6"]}
          style={styles.tipCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="bulb" size={24} color="#ffffff" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Daily Wellness Tip</Text>
            <Text style={styles.tipText}>{dailyTip}</Text>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {/* Water Intake */}
          <LinearGradient
            colors={["#3b82f6", "#06b6d4"]}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIcon}>
              <Ionicons name="water" size={24} color="#ffffff" />
            </View>
            <Text style={styles.statLabel}>Water Today</Text>
            <Text style={styles.statValue}>{waterConsumed}ml</Text>
            <Text style={styles.statSubtext}>Goal: {waterGoal}ml</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(waterPercentage, 100)}%` },
                ]}
              />
            </View>
          </LinearGradient>

          {/* Last Exercise */}
          <LinearGradient
            colors={["#f97316", "#ef4444"]}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIcon}>
              <Ionicons name="flame" size={24} color="#ffffff" />
            </View>
            <Text style={styles.statLabel}>Last Workout</Text>
            <Text style={styles.statValue}>{lastCalories}</Text>
            <Text style={styles.statSubtext}>Calories Burned</Text>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={["#3b82f6", "#2563eb"]}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="water" size={32} color="#ffffff" />
                <Text style={styles.actionText}>Log Water</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={["#10b981", "#059669"]}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="barbell" size={32} color="#ffffff" />
                <Text style={styles.actionText}>Start Workout</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={["#8b5cf6", "#7c3aed"]}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="camera" size={32} color="#ffffff" />
                <Text style={styles.actionText}>Share Photo</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={["#f59e0b", "#d97706"]}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="stats-chart" size={32} color="#ffffff" />
                <Text style={styles.actionText}>View Progress</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Goals</Text>
          <View style={styles.goalsCard}>
            <View style={styles.goalItem}>
              <Ionicons name="water" size={20} color={theme.primary} />
              <Text style={styles.goalText}>Drink 2000ml of water</Text>
              <Ionicons
                name={
                  waterConsumed >= waterGoal
                    ? "checkmark-circle"
                    : "ellipse-outline"
                }
                size={20}
                color={
                  waterConsumed >= waterGoal ? "#10b981" : theme.textTertiary
                }
              />
            </View>

            <View style={styles.goalDivider} />

            <View style={styles.goalItem}>
              <Ionicons name="barbell" size={20} color="#f97316" />
              <Text style={styles.goalText}>Complete 30 min exercise</Text>
              <Ionicons
                name="ellipse-outline"
                size={20}
                color={theme.textTertiary}
              />
            </View>

            <View style={styles.goalDivider} />

            <View style={styles.goalItem}>
              <Ionicons name="moon" size={20} color="#8b5cf6" />
              <Text style={styles.goalText}>Get 8 hours of sleep</Text>
              <Ionicons
                name="ellipse-outline"
                size={20}
                color={theme.textTertiary}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    greeting: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    userName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
    },
    notificationButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.primaryLight,
      justifyContent: "center",
      alignItems: "center",
    },
    tipCard: {
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 16,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    tipContent: {
      flex: 1,
      marginLeft: 12,
    },
    tipTitle: {
      fontSize: 12,
      color: "#ffffff",
      opacity: 0.9,
      marginBottom: 4,
    },
    tipText: {
      fontSize: 14,
      color: "#ffffff",
      fontWeight: "500",
    },
    statsContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      marginBottom: 24,
      gap: 12,
    },
    statCard: {
      flex: 1,
      padding: 16,
      borderRadius: 16,
      elevation: 2,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    statLabel: {
      fontSize: 12,
      color: "rgba(255, 255, 255, 0.8)",
      marginBottom: 4,
    },
    statValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: 2,
    },
    statSubtext: {
      fontSize: 12,
      color: "rgba(255, 255, 255, 0.7)",
      marginBottom: 8,
    },
    progressBar: {
      height: 4,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderRadius: 2,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#ffffff",
      borderRadius: 2,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 12,
    },
    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    actionCard: {
      width: (width - 52) / 2,
      aspectRatio: 1,
    },
    actionGradient: {
      flex: 1,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    actionText: {
      color: "#ffffff",
      fontSize: 14,
      fontWeight: "600",
      marginTop: 8,
    },
    goalsCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      elevation: 1,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
    goalItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
    },
    goalText: {
      flex: 1,
      fontSize: 14,
      color: theme.textSecondary,
      marginLeft: 12,
    },
    goalDivider: {
      height: 1,
      backgroundColor: theme.borderLight,
    },
  });

export default HomeScreen;
