import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../contexts/AuthContextRN";
import { useTheme } from "../contexts/ThemeContextRN";

export function SettingsScreen() {
  const { user, logout } = useAuth();
  const { theme, setTheme: setAppTheme, colors, isDark } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
    loadProfileImage();
    setName(user?.name || "");
    setEmail(user?.email || "");
    setUsername(user?.username || "");
  }, [user]);

  const loadSettings = async () => {
    const savedNotifications = await AsyncStorage.getItem("notifications");
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

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    await setAppTheme(newTheme);
  };

  const handleNotificationsToggle = async (value: boolean) => {
    setNotifications(value);
    await AsyncStorage.setItem("notifications", JSON.stringify(value));
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim() || !username.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      // Update user in AsyncStorage
      const usersStr = await AsyncStorage.getItem("users");
      const users = usersStr ? JSON.parse(usersStr) : [];
      const userIndex = users.findIndex((u: any) => u.id === user?.id);

      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          name,
          email,
          username,
        };
        await AsyncStorage.setItem("users", JSON.stringify(users));
        await AsyncStorage.setItem(
          "currentUser",
          JSON.stringify(users[userIndex])
        );

        Alert.alert("Success", "Profile updated successfully!");
        setEditingProfile(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(), style: "destructive" },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Profile Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Profile
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (editingProfile) {
                handleSaveProfile();
              } else {
                setEditingProfile(true);
              }
            }}
          >
            <Text style={styles.editButton}>
              {editingProfile ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {name.substring(0, 2).toUpperCase() || "U"}
                </Text>
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              <Feather name="camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {editingProfile ? (
            <View style={styles.editForm}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Name
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Username
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Email
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => {
                  setEditingProfile(false);
                  setName(user?.name || "");
                  setEmail(user?.email || "");
                  setUsername(user?.username || "");
                }}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {name}
              </Text>
              <Text style={styles.profileUsername}>@{username}</Text>
              <Text
                style={[styles.profileEmail, { color: colors.textSecondary }]}
              >
                {email}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Theme Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Appearance
        </Text>
        <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            Theme
          </Text>
          <View style={styles.themeOptions}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border },
                theme === "light" && styles.themeButtonActive,
              ]}
              onPress={() => handleThemeChange("light")}
            >
              <Feather
                name="sun"
                size={24}
                color={theme === "light" ? "#2563EB" : colors.textSecondary}
              />
              <Text
                style={[
                  styles.themeText,
                  { color: colors.textSecondary },
                  theme === "light" && styles.themeTextActive,
                ]}
              >
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border },
                theme === "dark" && styles.themeButtonActive,
              ]}
              onPress={() => handleThemeChange("dark")}
            >
              <Feather
                name="moon"
                size={24}
                color={theme === "dark" ? "#2563EB" : colors.textSecondary}
              />
              <Text
                style={[
                  styles.themeText,
                  { color: colors.textSecondary },
                  theme === "dark" && styles.themeTextActive,
                ]}
              >
                Dark
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border },
                theme === "system" && styles.themeButtonActive,
              ]}
              onPress={() => handleThemeChange("system")}
            >
              <Feather
                name="monitor"
                size={24}
                color={theme === "system" ? "#2563EB" : colors.textSecondary}
              />
              <Text
                style={[
                  styles.themeText,
                  { color: colors.textSecondary },
                  theme === "system" && styles.themeTextActive,
                ]}
              >
                System
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Preferences
        </Text>
        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingLeft}>
            <Feather name="bell" size={20} color={colors.textSecondary} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Push Notifications
              </Text>
              <Text
                style={[styles.settingDesc, { color: colors.textSecondary }]}
              >
                Receive workout reminders
              </Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={handleNotificationsToggle}
            trackColor={{
              false: isDark ? "#4B5563" : "#D1D5DB",
              true: "#93C5FD",
            }}
            thumbColor={notifications ? "#2563EB" : "#F3F4F6"}
          />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[
          styles.logoutButton,
          { backgroundColor: colors.card, borderColor: "#FEE2E2" },
        ]}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  editButton: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "600",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
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
    borderRadius: 12,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileInfo: {
    alignItems: "center",
    width: "100%",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    color: "#2563EB",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  editForm: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  cancelButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  settingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  themeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  themeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  themeButtonActive: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  themeText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  themeTextActive: {
    color: "#2563EB",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingInfo: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 13,
    color: "#6B7280",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FEE2E2",
    marginTop: 8,
    marginBottom: 24,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
});
