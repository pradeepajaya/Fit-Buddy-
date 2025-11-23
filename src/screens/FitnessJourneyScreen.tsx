import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContextRN";

interface JourneyEntry {
  id: string;
  date: string;
  text: string;
  emoji: string;
  photo?: string;
}

const MOOD_EMOJIS = [
  "💪",
  "😊",
  "🔥",
  "😌",
  "😅",
  "🤩",
  "😤",
  "🎉",
  "💯",
  "⭐",
  "🏆",
  "👏",
];

export function FitnessJourneyScreen() {
  const { colors } = useTheme();
  const [entries, setEntries] = useState<JourneyEntry[]>([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntryText, setNewEntryText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("💪");
  const [selectedPhoto, setSelectedPhoto] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem("fitnessJourney");
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load fitness journey:", error);
    }
  };

  const saveEntries = async (newEntries: JourneyEntry[]) => {
    try {
      await AsyncStorage.setItem("fitnessJourney", JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error("Failed to save fitness journey:", error);
      Alert.alert("Error", "Failed to save entry. Please try again.");
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedPhoto(result.assets[0].uri);
    }
  };

  const handleChoosePhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Photo library permission is required to choose photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedPhoto(result.assets[0].uri);
    }
  };

  const handleSaveEntry = () => {
    if (!newEntryText.trim()) {
      Alert.alert("Validation", "Please add some text to your entry.");
      return;
    }

    const newEntry: JourneyEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      text: newEntryText.trim(),
      emoji: selectedEmoji,
      photo: selectedPhoto,
    };

    const updatedEntries = [newEntry, ...entries];
    saveEntries(updatedEntries);

    // Reset form
    setNewEntryText("");
    setSelectedEmoji("💪");
    setSelectedPhoto(undefined);
    setShowAddEntry(false);

    Alert.alert("Success", "Your fitness journey entry has been saved!");
  };

  const handleDeleteEntry = (id: string) => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedEntries = entries.filter((entry) => entry.id !== id);
          saveEntries(updatedEntries);
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              Fitness Journey
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Document your progress
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowAddEntry(!showAddEntry)}
          >
            <Feather
              name={showAddEntry ? "x" : "plus"}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Add Entry Form */}
        {showAddEntry && (
          <View style={[styles.addEntryCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>
              New Entry
            </Text>

            {/* Photo Section */}
            <View style={styles.photoSection}>
              {selectedPhoto ? (
                <View style={styles.photoPreview}>
                  <Image
                    source={{ uri: selectedPhoto }}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => setSelectedPhoto(undefined)}
                  >
                    <Feather name="x" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.photoButtons}>
                  <TouchableOpacity
                    style={[
                      styles.photoButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleTakePhoto}
                  >
                    <Feather name="camera" size={20} color="#FFFFFF" />
                    <Text style={styles.photoButtonText}>Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.photoButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleChoosePhoto}
                  >
                    <Feather name="image" size={20} color="#FFFFFF" />
                    <Text style={styles.photoButtonText}>Choose Photo</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Emoji Selection */}
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              How are you feeling?
            </Text>
            <View style={styles.emojiGrid}>
              {MOOD_EMOJIS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiButton,
                    {
                      backgroundColor:
                        selectedEmoji === emoji
                          ? colors.primary + "20"
                          : colors.background,
                      borderColor:
                        selectedEmoji === emoji
                          ? colors.primary
                          : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedEmoji(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Text Input */}
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              Your thoughts
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Share your progress, goals, or how you're feeling..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              value={newEntryText}
              onChangeText={setNewEntryText}
            />

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSaveEntry}
            >
              <Feather name="check" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Entries List */}
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="book" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No entries yet
            </Text>
            <Text
              style={[styles.emptySubtext, { color: colors.textSecondary }]}
            >
              Start documenting your fitness journey!
            </Text>
          </View>
        ) : (
          <View style={styles.entriesList}>
            {entries.map((entry) => (
              <View
                key={entry.id}
                style={[styles.entryCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.entryHeader}>
                  <View style={styles.entryHeaderLeft}>
                    <Text style={styles.entryEmoji}>{entry.emoji}</Text>
                    <Text
                      style={[
                        styles.entryDate,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {formatDate(entry.date)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteEntry(entry.id)}
                    style={styles.deleteButton}
                  >
                    <Feather name="trash-2" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                {entry.photo && (
                  <Image
                    source={{ uri: entry.photo }}
                    style={styles.entryImage}
                  />
                )}

                <Text style={[styles.entryText, { color: colors.text }]}>
                  {entry.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  addEntryCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  photoSection: {
    marginBottom: 20,
  },
  photoButtons: {
    flexDirection: "row",
    gap: 12,
  },
  photoButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  photoButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  photoPreview: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  removePhotoButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  emojiButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiText: {
    fontSize: 28,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 20,
    minHeight: 120,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  entriesList: {
    padding: 16,
    gap: 16,
  },
  entryCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  entryHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  entryEmoji: {
    fontSize: 32,
  },
  entryDate: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  entryImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  entryText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
