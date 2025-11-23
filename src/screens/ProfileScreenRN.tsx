import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../contexts/AuthContextRN";

export function ProfileScreenRN() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
    loadProfileImage();
  }, []);

  const loadSettings = async () => {
    const savedTheme = await AsyncStorage.getItem("theme");
    const savedNotifications = await AsyncStorage.getItem("notifications");
    if (savedTheme) setTheme(savedTheme);
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  };

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem("profileImage");
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error("Failed to load profile image:", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to change your profile picture!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await AsyncStorage.setItem("profileImage", imageUri);
    }
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const handleNotificationsToggle = async (value: boolean) => {
    setNotifications(value);
    await AsyncStorage.setItem("notifications", JSON.stringify(value));
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.substring(0, 2).toUpperCase() || "U"}
              </Text>
            </View>
          )}
          <View style={styles.cameraIconContainer}>
            <Feather name="camera" size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{user?.name || "User"}</Text>
        <Text style={styles.email}>{user?.email || "user@example.com"}</Text>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        {/* Theme Settings */}
        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Theme</Text>
          <View style={styles.themeOptions}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                theme === "light" && styles.themeButtonActive,
              ]}
              onPress={() => handleThemeChange("light")}
            >
              <Feather
                name="sun"
                size={24}
                color={theme === "light" ? "#2563EB" : "#6B7280"}
              />
              <Text
                style={[
                  styles.themeText,
                  theme === "light" && styles.themeTextActive,
                ]}
              >
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                theme === "dark" && styles.themeButtonActive,
              ]}
              onPress={() => handleThemeChange("dark")}
            >
              <Feather
                name="moon"
                size={24}
                color={theme === "dark" ? "#2563EB" : "#6B7280"}
              />
              <Text
                style={[
                  styles.themeText,
                  theme === "dark" && styles.themeTextActive,
                ]}
              >
                Dark
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                theme === "system" && styles.themeButtonActive,
              ]}
              onPress={() => handleThemeChange("system")}
            >
              <Feather
                name="monitor"
                size={24}
                color={theme === "system" ? "#2563EB" : "#6B7280"}
              />
              <Text
                style={[
                  styles.themeText,
                  theme === "system" && styles.themeTextActive,
                ]}
              >
                System
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Feather name="bell" size={20} color="#6B7280" />
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDesc}>Receive workout reminders</Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
            thumbColor={notifications ? "#2563EB" : "#F3F4F6"}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Health Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Metrics</Text>
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>BMI</Text>
            <Text style={styles.metricValue}>22.5</Text>
            <Text style={styles.metricStatus}>Normal</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Weight</Text>
            <Text style={styles.metricValue}>70 kg</Text>
            <Text style={styles.metricStatus}>Target: 68 kg</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Goal</Text>
            <Text style={styles.metricValue}>5</Text>
            <Text style={styles.metricStatus}>Workouts/week</Text>
          </View>
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
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563EB",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  settingCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  themeOptions: {
    flexDirection: "row",
    gap: 8,
  },
  themeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  themeButtonActive: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  themeText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  themeTextActive: {
    color: "#2563EB",
    fontWeight: "600",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingInfo: {
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  settingDesc: {
    fontSize: 12,
    color: "#6B7280",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 8,
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  metricStatus: {
    fontSize: 10,
    color: "#FFFFFF",
  },
});
