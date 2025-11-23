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
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../contexts/ThemeContext";

const { width } = Dimensions.get("window");

interface WellnessTip {
  id: string;
  category: "diet" | "mental" | "fitness" | "sleep";
  icon: string;
  title: string;
  description: string;
  gradient: string[];
}

const wellnessTips: WellnessTip[] = [
  {
    id: "1",
    category: "diet",
    icon: "nutrition",
    title: "Balanced Nutrition",
    description:
      "Include a variety of colorful fruits and vegetables in your meals. Aim for at least 5 servings per day.",
    gradient: ["#10b981", "#059669"],
  },
  {
    id: "2",
    category: "diet",
    icon: "restaurant",
    title: "Meal Planning",
    description:
      "Plan your meals ahead of time to ensure balanced nutrition and avoid unhealthy choices.",
    gradient: ["#3b82f6", "#2563eb"],
  },
  {
    id: "3",
    category: "mental",
    icon: "happy",
    title: "Mindfulness Practice",
    description:
      "Take 10 minutes daily for meditation or deep breathing exercises to reduce stress and anxiety.",
    gradient: ["#8b5cf6", "#7c3aed"],
  },
  {
    id: "4",
    category: "mental",
    icon: "book",
    title: "Journaling",
    description:
      "Write down your thoughts and feelings each day to improve mental clarity and emotional wellbeing.",
    gradient: ["#f59e0b", "#d97706"],
  },
  {
    id: "5",
    category: "fitness",
    icon: "walk",
    title: "Daily Movement",
    description:
      "Take short walking breaks every hour if you have a sedentary job. Even 5 minutes helps!",
    gradient: ["#ef4444", "#dc2626"],
  },
  {
    id: "6",
    category: "fitness",
    icon: "barbell",
    title: "Strength Training",
    description:
      "Incorporate resistance training 2-3 times per week to build muscle and improve bone density.",
    gradient: ["#f97316", "#ea580c"],
  },
  {
    id: "7",
    category: "sleep",
    icon: "moon",
    title: "Sleep Routine",
    description:
      "Maintain a consistent sleep schedule. Go to bed and wake up at the same time every day.",
    gradient: ["#6366f1", "#4f46e5"],
  },
  {
    id: "8",
    category: "sleep",
    icon: "bed",
    title: "Sleep Environment",
    description:
      "Create a cool, dark, and quiet sleeping environment. Avoid screens 1 hour before bedtime.",
    gradient: ["#06b6d4", "#0891b2"],
  },
  {
    id: "9",
    category: "diet",
    icon: "water",
    title: "Hydration",
    description:
      "Drink water throughout the day. Start your morning with a glass of water to kickstart your metabolism.",
    gradient: ["#3b82f6", "#06b6d4"],
  },
  {
    id: "10",
    category: "diet",
    icon: "fast-food",
    title: "Portion Control",
    description:
      "Use smaller plates and bowls to naturally reduce portion sizes without feeling deprived.",
    gradient: ["#ec4899", "#db2777"],
  },
];

const WellnessScreen = () => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: "all", label: "All", icon: "grid" },
    { id: "diet", label: "Diet", icon: "nutrition" },
    { id: "mental", label: "Mental", icon: "happy" },
    { id: "fitness", label: "Fitness", icon: "barbell" },
    { id: "sleep", label: "Sleep", icon: "moon" },
  ];

  const filteredTips =
    selectedCategory === "all"
      ? wellnessTips
      : wellnessTips.filter((tip) => tip.category === selectedCategory);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Wellness Tips</Text>
            <Text style={styles.subtitle}>
              Expert advice for a healthier you
            </Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Icon
                name={category.icon}
                size={18}
                color={
                  selectedCategory === category.id
                    ? "#ffffff"
                    : theme.textSecondary
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tips Grid */}
        <View style={styles.tipsContainer}>
          {filteredTips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <LinearGradient
                colors={tip.gradient}
                style={styles.tipGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.tipHeader}>
                  <View style={styles.tipIconContainer}>
                    <Icon name={tip.icon} size={24} color="#ffffff" />
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(tip.id)}
                    style={styles.favoriteButton}
                  >
                    <Icon
                      name={
                        favorites.includes(tip.id) ? "heart" : "heart-outline"
                      }
                      size={20}
                      color="#ffffff"
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {tip.category.toUpperCase()}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Diet Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Diet Plans</Text>

          <View style={styles.dietCard}>
            <LinearGradient
              colors={["#10b981", "#059669"]}
              style={styles.dietGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.dietIcon}>
                <Icon name="leaf" size={28} color="#ffffff" />
              </View>
              <View style={styles.dietContent}>
                <Text style={styles.dietTitle}>Mediterranean Diet</Text>
                <Text style={styles.dietDescription}>
                  Rich in fruits, vegetables, and healthy fats
                </Text>
              </View>
              <Icon name="chevron-forward" size={24} color="#ffffff" />
            </LinearGradient>
          </View>

          <View style={styles.dietCard}>
            <LinearGradient
              colors={["#3b82f6", "#2563eb"]}
              style={styles.dietGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.dietIcon}>
                <Icon name="fitness" size={28} color="#ffffff" />
              </View>
              <View style={styles.dietContent}>
                <Text style={styles.dietTitle}>High Protein Plan</Text>
                <Text style={styles.dietDescription}>
                  Perfect for muscle building and recovery
                </Text>
              </View>
              <Icon name="chevron-forward" size={24} color="#ffffff" />
            </LinearGradient>
          </View>

          <View style={styles.dietCard}>
            <LinearGradient
              colors={["#8b5cf6", "#7c3aed"]}
              style={styles.dietGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.dietIcon}>
                <Icon name="nutrition" size={28} color="#ffffff" />
              </View>
              <View style={styles.dietContent}>
                <Text style={styles.dietTitle}>Balanced Nutrition</Text>
                <Text style={styles.dietDescription}>
                  Well-rounded approach for general health
                </Text>
              </View>
              <Icon name="chevron-forward" size={24} color="#ffffff" />
            </LinearGradient>
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
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    searchButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.primaryLight,
      justifyContent: "center",
      alignItems: "center",
    },
    categoriesContainer: {
      marginBottom: 20,
    },
    categoriesContent: {
      paddingHorizontal: 20,
      gap: 10,
    },
    categoryChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 6,
    },
    categoryChipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryText: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: "500",
    },
    categoryTextActive: {
      color: "#ffffff",
    },
    tipsContainer: {
      paddingHorizontal: 20,
      gap: 16,
      marginBottom: 24,
    },
    tipCard: {
      borderRadius: 20,
      overflow: "hidden",
      elevation: 3,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    tipGradient: {
      padding: 20,
    },
    tipHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    tipIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    favoriteButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    tipTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: 8,
    },
    tipDescription: {
      fontSize: 14,
      color: "#FFFFFF",
      lineHeight: 20,
      marginBottom: 12,
    },
    categoryBadge: {
      alignSelf: "flex-start",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    categoryBadgeText: {
      fontSize: 11,
      fontWeight: "600",
      color: "#ffffff",
      letterSpacing: 0.5,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 16,
    },
    dietCard: {
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 12,
      elevation: 2,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    dietGradient: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },
    dietIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    dietContent: {
      flex: 1,
      marginLeft: 16,
    },
    dietTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: 4,
    },
    dietDescription: {
      fontSize: 13,
      color: "rgba(255, 255, 255, 0.8)",
    },
  });

export default WellnessScreen;
