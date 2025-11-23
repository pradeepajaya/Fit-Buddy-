import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContextRN";

interface Food {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  emoji: string;
}

const AVAILABLE_FOODS: Food[] = [
  {
    id: "1",
    name: "Avocado Toast",
    category: "breakfast",
    calories: 320,
    protein: 8,
    carbs: 35,
    fats: 18,
    emoji: "🥑",
  },
  {
    id: "2",
    name: "Boiled Eggs",
    category: "breakfast",
    calories: 155,
    protein: 13,
    carbs: 1,
    fats: 11,
    emoji: "🥚",
  },
  {
    id: "3",
    name: "Orange Juice",
    category: "breakfast",
    calories: 110,
    protein: 2,
    carbs: 26,
    fats: 0,
    emoji: "🥤",
  },
  {
    id: "4",
    name: "Oatmeal",
    category: "breakfast",
    calories: 150,
    protein: 5,
    carbs: 27,
    fats: 3,
    emoji: "🥣",
  },
  {
    id: "5",
    name: "Greek Yogurt",
    category: "breakfast",
    calories: 100,
    protein: 10,
    carbs: 6,
    fats: 4,
    emoji: "🥛",
  },
  {
    id: "6",
    name: "Banana",
    category: "breakfast",
    calories: 105,
    protein: 1,
    carbs: 27,
    fats: 0,
    emoji: "🍌",
  },
  {
    id: "7",
    name: "Grilled Chicken",
    category: "lunch",
    calories: 285,
    protein: 53,
    carbs: 0,
    fats: 6,
    emoji: "🍗",
  },
  {
    id: "8",
    name: "Caesar Salad",
    category: "lunch",
    calories: 180,
    protein: 8,
    carbs: 12,
    fats: 12,
    emoji: "🥗",
  },
  {
    id: "9",
    name: "Brown Rice",
    category: "lunch",
    calories: 215,
    protein: 5,
    carbs: 45,
    fats: 2,
    emoji: "🍚",
  },
  {
    id: "10",
    name: "Quinoa",
    category: "lunch",
    calories: 220,
    protein: 8,
    carbs: 39,
    fats: 4,
    emoji: "🌾",
  },
  {
    id: "11",
    name: "Beef Burger",
    category: "lunch",
    calories: 354,
    protein: 25,
    carbs: 30,
    fats: 15,
    emoji: "🍔",
  },
  {
    id: "12",
    name: "Pasta",
    category: "lunch",
    calories: 200,
    protein: 7,
    carbs: 40,
    fats: 1,
    emoji: "🍝",
  },
  {
    id: "13",
    name: "Salmon",
    category: "dinner",
    calories: 350,
    protein: 39,
    carbs: 0,
    fats: 22,
    emoji: "🐟",
  },
  {
    id: "14",
    name: "Broccoli",
    category: "dinner",
    calories: 55,
    protein: 4,
    carbs: 11,
    fats: 1,
    emoji: "🥦",
  },
  {
    id: "15",
    name: "Sweet Potato",
    category: "dinner",
    calories: 180,
    protein: 4,
    carbs: 41,
    fats: 0,
    emoji: "🥔",
  },
  {
    id: "16",
    name: "Steak",
    category: "dinner",
    calories: 310,
    protein: 42,
    carbs: 0,
    fats: 15,
    emoji: "🥩",
  },
  {
    id: "17",
    name: "Green Beans",
    category: "dinner",
    calories: 44,
    protein: 2,
    carbs: 10,
    fats: 0,
    emoji: "🫛",
  },
  {
    id: "18",
    name: "Shrimp",
    category: "dinner",
    calories: 99,
    protein: 24,
    carbs: 0,
    fats: 1,
    emoji: "🦐",
  },
];

export function DietPlannerScreen() {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
  const [customFood, setCustomFood] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showAvailableFoodsModal, setShowAvailableFoodsModal] = useState(false);
  const [availableFoods, setAvailableFoods] = useState<Food[]>([]);
  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodCategory, setNewFoodCategory] = useState("breakfast");
  const [newFoodCalories, setNewFoodCalories] = useState("");
  const [newFoodProtein, setNewFoodProtein] = useState("");
  const [newFoodCarbs, setNewFoodCarbs] = useState("");
  const [newFoodFats, setNewFoodFats] = useState("");
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [tempSelectedFoods, setTempSelectedFoods] = useState<Food[]>([]);

  useEffect(() => {
    loadSelectedFoods();
    loadAvailableFoods();
  }, []);

  const loadSelectedFoods = async () => {
    try {
      const stored = await AsyncStorage.getItem("selectedFoods");
      if (stored) {
        setSelectedFoods(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load selected foods:", error);
    }
  };

  const loadAvailableFoods = async () => {
    try {
      const stored = await AsyncStorage.getItem("userAvailableFoods");
      if (stored) {
        setAvailableFoods(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load available foods:", error);
    }
  };

  const saveSelectedFoods = async (foods: Food[]) => {
    try {
      await AsyncStorage.setItem("selectedFoods", JSON.stringify(foods));
    } catch (error) {
      console.error("Failed to save selected foods:", error);
    }
  };

  const saveAvailableFoods = async (foods: Food[]) => {
    try {
      await AsyncStorage.setItem("userAvailableFoods", JSON.stringify(foods));
    } catch (error) {
      console.error("Failed to save available foods:", error);
    }
  };

  const addToAvailableFoods = () => {
    if (!newFoodName.trim()) {
      Alert.alert("Error", "Please enter a food name");
      return;
    }

    const calories = parseInt(newFoodCalories) || 0;
    const protein = parseInt(newFoodProtein) || 0;
    const carbs = parseInt(newFoodCarbs) || 0;
    const fats = parseInt(newFoodFats) || 0;

    const newFood: Food = {
      id: `user-${Date.now()}`,
      name: newFoodName.trim(),
      category: newFoodCategory,
      calories,
      protein,
      carbs,
      fats,
      emoji: "🍽️",
    };

    const updated = [...availableFoods, newFood];
    setAvailableFoods(updated);
    saveAvailableFoods(updated);
    setNewFoodName("");
    setNewFoodCalories("");
    setNewFoodProtein("");
    setNewFoodCarbs("");
    setNewFoodFats("");
    setNewFoodCategory("breakfast");
    Alert.alert("Success", `${newFood.name} added to ${newFood.category}!`);
  };

  const removeFromAvailableFoods = (foodId: string) => {
    const updated = availableFoods.filter((f) => f.id !== foodId);
    setAvailableFoods(updated);
    saveAvailableFoods(updated);
  };

  const selectFromAvailableFoods = (food: Food) => {
    const isAlreadySelected = selectedFoods.some((f) => f.id === food.id);
    if (!isAlreadySelected) {
      const updated = [...selectedFoods, food];
      setSelectedFoods(updated);
      saveSelectedFoods(updated);
      Alert.alert("Added", `${food.name} added to ${food.category}!`);
    }
  };

  const toggleFoodSelection = (food: Food) => {
    const isSelected = selectedFoods.some((f) => f.id === food.id);
    let updated: Food[];

    if (isSelected) {
      updated = selectedFoods.filter((f) => f.id !== food.id);
    } else {
      updated = [...selectedFoods, food];
    }

    setSelectedFoods(updated);
    saveSelectedFoods(updated);
  };

  const addCustomFood = () => {
    if (!customFood.trim()) return;

    const newFood: Food = {
      id: `custom-${Date.now()}`,
      name: customFood.trim(),
      category: activeCategory === "all" ? "breakfast" : activeCategory,
      calories: 150,
      protein: 5,
      carbs: 20,
      fats: 5,
      emoji: "🍽️",
    };

    const updated = [...selectedFoods, newFood];
    setSelectedFoods(updated);
    saveSelectedFoods(updated);
    setCustomFood("");
    Alert.alert("Success", "Custom food added!");
  };

  const filteredFoods = AVAILABLE_FOODS.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || food.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const isSelected = (foodId: string) =>
    selectedFoods.some((f) => f.id === foodId);

  const isTempSelected = (foodId: string) =>
    tempSelectedFoods.some((f) => f.id === foodId);

  const toggleTempSelection = (food: Food) => {
    if (isTempSelected(food.id)) {
      setTempSelectedFoods(tempSelectedFoods.filter((f) => f.id !== food.id));
    } else {
      setTempSelectedFoods([...tempSelectedFoods, food]);
    }
  };

  const addSelectedFoodsToDiet = () => {
    const newFoods = tempSelectedFoods.filter(
      (food) => !selectedFoods.some((f) => f.id === food.id)
    );
    const updated = [...selectedFoods, ...newFoods];
    setSelectedFoods(updated);
    saveSelectedFoods(updated);
    setTempSelectedFoods([]);
    setMultiSelectMode(false);
    setShowAvailableFoodsModal(false);
    Alert.alert(
      "Success",
      `Added ${newFoods.length} food(s) to your diet plan!`
    );
  };

  const cancelMultiSelect = () => {
    setTempSelectedFoods([]);
    setMultiSelectMode(false);
  };

  const selectedByCategory = (category: string) =>
    selectedFoods.filter((f) => f.category === category);

  const renderCategorySection = (category: string, title: string) => {
    const recommendedFoods = AVAILABLE_FOODS.filter(
      (f) => f.category === category
    );
    const categorySelected = selectedByCategory(category);
    const totalCalories = categorySelected.reduce(
      (sum, f) => sum + f.calories,
      0
    );

    return (
      <View key={category} style={styles.categoryContainer}>
        <View style={styles.categoryTitleRow}>
          <Text style={[styles.categoryTitle, { color: colors.text }]}>
            {title}
          </Text>
          {categorySelected.length > 0 && (
            <Text style={[styles.categoryCalories, { color: colors.primary }]}>
              {totalCalories} cal
            </Text>
          )}
        </View>

        {/* Selected Foods for this category */}
        {categorySelected.length > 0 && (
          <View
            style={[
              styles.selectedInCategory,
              { backgroundColor: colors.card },
            ]}
          >
            {categorySelected.map((food) => (
              <View key={food.id} style={styles.selectedFoodRow}>
                <Text style={styles.selectedFoodEmoji}>{food.emoji}</Text>
                <View style={styles.selectedFoodInfo}>
                  <Text
                    style={[styles.selectedFoodName, { color: colors.text }]}
                  >
                    {food.name}
                  </Text>
                  <Text
                    style={[
                      styles.selectedFoodCalories,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {food.calories} cal
                  </Text>
                </View>
                <TouchableOpacity onPress={() => toggleFoodSelection(food)}>
                  <Feather name="x" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Recommended Foods */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.recommendedRow}>
            {recommendedFoods.slice(0, 6).map((food) => (
              <TouchableOpacity
                key={food.id}
                style={[
                  styles.recommendedCard,
                  { backgroundColor: colors.card },
                  isSelected(food.id) && {
                    borderColor: colors.primary,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => toggleFoodSelection(food)}
              >
                {isSelected(food.id) && (
                  <View
                    style={[
                      styles.selectedBadge,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Feather name="check" size={12} color="#FFFFFF" />
                  </View>
                )}
                <Text style={styles.recommendedEmoji}>{food.emoji}</Text>
                <Text
                  style={[styles.recommendedName, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {food.name}
                </Text>
                <Text
                  style={[
                    styles.recommendedCalories,
                    { color: colors.textSecondary },
                  ]}
                >
                  {food.calories} cal
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diet Planner</Text>
        <TouchableOpacity onPress={() => setShowAvailableFoodsModal(true)}>
          <Feather name="package" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Summary Card */}
        {selectedFoods.length > 0 && (
          <View
            style={[
              styles.dailySummaryCard,
              { backgroundColor: colors.primary },
            ]}
          >
            <View style={styles.dailySummaryHeader}>
              <Text style={styles.dailySummaryTitle}>Today's Nutrition</Text>
              <Feather name="pie-chart" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.dailySummaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {selectedFoods.reduce((sum, f) => sum + f.calories, 0)}
                </Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {selectedFoods.reduce((sum, f) => sum + f.protein, 0)}g
                </Text>
                <Text style={styles.statLabel}>Protein</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {selectedFoods.reduce((sum, f) => sum + f.carbs, 0)}g
                </Text>
                <Text style={styles.statLabel}>Carbs</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {selectedFoods.reduce((sum, f) => sum + f.fats, 0)}g
                </Text>
                <Text style={styles.statLabel}>Fats</Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick Action Button */}
        <TouchableOpacity
          style={[
            styles.selectFoodsButton,
            {
              backgroundColor:
                selectedFoods.length > 0 ? colors.card : colors.primary,
            },
            { borderColor: colors.primary },
          ]}
          onPress={() => setShowAvailableFoodsModal(true)}
        >
          <Feather
            name="plus-circle"
            size={22}
            color={selectedFoods.length > 0 ? colors.primary : "#FFFFFF"}
          />
          <Text
            style={[
              styles.selectFoodsButtonText,
              { color: selectedFoods.length > 0 ? colors.primary : "#FFFFFF" },
            ]}
          >
            {selectedFoods.length > 0
              ? "Add More Foods"
              : "Start Planning Your Meals"}
          </Text>
        </TouchableOpacity>

        {/* Meal Sections */}
        <View style={styles.mealsContainer}>
          {renderCategorySection("breakfast", "☀️ Breakfast")}
          {renderCategorySection("lunch", "🌤️ Lunch")}
          {renderCategorySection("dinner", "🌙 Dinner")}
        </View>
      </ScrollView>

      {/* Available Foods Modal */}
      <Modal
        visible={showAvailableFoodsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAvailableFoodsModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View
            style={[
              styles.availableFoodsModal,
              { backgroundColor: colors.card },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {multiSelectMode
                    ? `Selected (${tempSelectedFoods.length})`
                    : "All Foods"}
                </Text>
                <Text
                  style={[
                    styles.modalSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  {multiSelectMode
                    ? "Tap to select/deselect"
                    : "Browse or add your own"}
                </Text>
              </View>
              <View style={styles.modalHeaderActions}>
                <TouchableOpacity
                  style={[
                    styles.multiSelectButton,
                    {
                      backgroundColor: multiSelectMode
                        ? colors.primary
                        : "transparent",
                    },
                    { borderColor: colors.primary },
                  ]}
                  onPress={() => {
                    if (multiSelectMode) {
                      cancelMultiSelect();
                    } else {
                      setMultiSelectMode(true);
                    }
                  }}
                >
                  <Feather
                    name={multiSelectMode ? "check-square" : "square"}
                    size={20}
                    color={multiSelectMode ? "#FFFFFF" : colors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setShowAvailableFoodsModal(false);
                    setMultiSelectMode(false);
                    setTempSelectedFoods([]);
                  }}
                >
                  <Feather name="x" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Add New Food Section */}
              <View
                style={[
                  styles.addFoodSection,
                  { backgroundColor: colors.surface || colors.background },
                ]}
              >
                <View style={styles.addFoodHeader}>
                  <Feather
                    name="plus-square"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={[styles.addFoodTitle, { color: colors.text }]}>
                    Create Custom Food
                  </Text>
                </View>
                <Text
                  style={[
                    styles.addFoodDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Add your own custom foods to the list
                </Text>

                <View style={styles.customFoodForm}>
                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: colors.text }]}>
                      Food Name
                    </Text>
                    <TextInput
                      style={[
                        styles.foodInput,
                        {
                          color: colors.text,
                          borderColor: colors.border,
                          backgroundColor: colors.background,
                        },
                      ]}
                      placeholder="e.g., Protein Shake"
                      placeholderTextColor={colors.textSecondary}
                      value={newFoodName}
                      onChangeText={setNewFoodName}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: colors.text }]}>
                      Meal Type
                    </Text>
                    <View style={styles.categoryPickerRow}>
                      {["breakfast", "lunch", "dinner"].map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.categoryPickerButton,
                            { borderColor: colors.border },
                            newFoodCategory === cat && {
                              backgroundColor: colors.primary,
                            },
                          ]}
                          onPress={() => setNewFoodCategory(cat)}
                        >
                          <Text
                            style={[
                              styles.categoryPickerText,
                              {
                                color:
                                  newFoodCategory === cat
                                    ? "#FFFFFF"
                                    : colors.text,
                              },
                            ]}
                          >
                            {cat === "breakfast"
                              ? "🌅"
                              : cat === "lunch"
                              ? "☀️"
                              : "🌙"}{" "}
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: colors.text }]}>
                      Nutritional Information
                    </Text>
                    <View style={styles.nutritionRow}>
                      <View style={styles.nutritionInputWrapper}>
                        <Text
                          style={[
                            styles.nutritionLabel,
                            { color: colors.textSecondary },
                          ]}
                        >
                          Calories
                        </Text>
                        <TextInput
                          style={[
                            styles.nutritionInput,
                            {
                              color: colors.text,
                              borderColor: colors.border,
                              backgroundColor: colors.background,
                            },
                          ]}
                          placeholder="0"
                          placeholderTextColor={colors.textSecondary}
                          value={newFoodCalories}
                          onChangeText={setNewFoodCalories}
                          keyboardType="numeric"
                          returnKeyType="done"
                        />
                      </View>
                      <View style={styles.nutritionInputWrapper}>
                        <Text
                          style={[
                            styles.nutritionLabel,
                            { color: colors.textSecondary },
                          ]}
                        >
                          Protein (g)
                        </Text>
                        <TextInput
                          style={[
                            styles.nutritionInput,
                            {
                              color: colors.text,
                              borderColor: colors.border,
                              backgroundColor: colors.background,
                            },
                          ]}
                          placeholder="0"
                          placeholderTextColor={colors.textSecondary}
                          value={newFoodProtein}
                          onChangeText={setNewFoodProtein}
                          keyboardType="numeric"
                          returnKeyType="done"
                        />
                      </View>
                    </View>
                    <View style={styles.nutritionRow}>
                      <View style={styles.nutritionInputWrapper}>
                        <Text
                          style={[
                            styles.nutritionLabel,
                            { color: colors.textSecondary },
                          ]}
                        >
                          Carbs (g)
                        </Text>
                        <TextInput
                          style={[
                            styles.nutritionInput,
                            {
                              color: colors.text,
                              borderColor: colors.border,
                              backgroundColor: colors.background,
                            },
                          ]}
                          placeholder="0"
                          placeholderTextColor={colors.textSecondary}
                          value={newFoodCarbs}
                          onChangeText={setNewFoodCarbs}
                          keyboardType="numeric"
                          returnKeyType="done"
                        />
                      </View>
                      <View style={styles.nutritionInputWrapper}>
                        <Text
                          style={[
                            styles.nutritionLabel,
                            { color: colors.textSecondary },
                          ]}
                        >
                          Fats (g)
                        </Text>
                        <TextInput
                          style={[
                            styles.nutritionInput,
                            {
                              color: colors.text,
                              borderColor: colors.border,
                              backgroundColor: colors.background,
                            },
                          ]}
                          placeholder="0"
                          placeholderTextColor={colors.textSecondary}
                          value={newFoodFats}
                          onChangeText={setNewFoodFats}
                          keyboardType="numeric"
                          returnKeyType="done"
                        />
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.addFoodButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={addToAvailableFoods}
                  >
                    <Feather name="plus-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.addFoodButtonText}>
                      Add Custom Food
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* All Available Foods (AVAILABLE_FOODS + User Foods) */}
              <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
                All Available Foods
              </Text>
              <View style={styles.availableFoodsList}>
                {[...AVAILABLE_FOODS, ...availableFoods].length === 0 ? (
                  <Text
                    style={[styles.emptyText, { color: colors.textSecondary }]}
                  >
                    No foods available yet. Add some above!
                  </Text>
                ) : (
                  [...AVAILABLE_FOODS, ...availableFoods].map((food) => (
                    <TouchableOpacity
                      key={food.id}
                      style={[
                        styles.availableFoodItem,
                        { backgroundColor: colors.background },
                        multiSelectMode &&
                          isTempSelected(food.id) && {
                            backgroundColor: colors.primary + "20",
                            borderColor: colors.primary,
                            borderWidth: 2,
                          },
                      ]}
                      onPress={() => {
                        if (multiSelectMode) {
                          toggleTempSelection(food);
                        } else {
                          selectFromAvailableFoods(food);
                          setShowAvailableFoodsModal(false);
                        }
                      }}
                    >
                      {multiSelectMode && (
                        <View
                          style={[
                            styles.checkbox,
                            { borderColor: colors.border },
                            isTempSelected(food.id) && {
                              backgroundColor: colors.primary,
                              borderColor: colors.primary,
                            },
                          ]}
                        >
                          {isTempSelected(food.id) && (
                            <Feather name="check" size={16} color="#FFFFFF" />
                          )}
                        </View>
                      )}
                      <Text style={styles.availableFoodEmoji}>
                        {food.emoji}
                      </Text>
                      <View style={styles.availableFoodInfo}>
                        <Text
                          style={[
                            styles.availableFoodName,
                            { color: colors.text },
                          ]}
                        >
                          {food.name}
                        </Text>
                        <Text
                          style={[
                            styles.availableFoodStats,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {food.category === "breakfast"
                            ? "🌅"
                            : food.category === "lunch"
                            ? "☀️"
                            : "🌙"}{" "}
                          {food.category.charAt(0).toUpperCase() +
                            food.category.slice(1)}{" "}
                          • {food.calories} cal • P:{food.protein}g C:
                          {food.carbs}g F:{food.fats}g
                        </Text>
                      </View>
                      {!multiSelectMode && (
                        <TouchableOpacity
                          style={[
                            styles.selectFoodButton,
                            { backgroundColor: colors.primary },
                          ]}
                          onPress={() => {
                            selectFromAvailableFoods(food);
                            setShowAvailableFoodsModal(false);
                          }}
                        >
                          <Feather name="plus" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                      {!multiSelectMode && food.id.startsWith("user-") && (
                        <TouchableOpacity
                          style={[
                            styles.removeFoodButton,
                            { backgroundColor: colors.error },
                          ]}
                          onPress={() => removeFromAvailableFoods(food.id)}
                        >
                          <Feather name="trash-2" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>

        {/* Multi-Select Floating Action Bar */}
        {multiSelectMode && tempSelectedFoods.length > 0 && (
          <View
            style={[
              styles.floatingActionBar,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.floatingActionText}>
              {tempSelectedFoods.length} food
              {tempSelectedFoods.length > 1 ? "s" : ""} selected
            </Text>
            <View style={styles.floatingActionButtons}>
              <TouchableOpacity
                style={[
                  styles.floatingButton,
                  { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                ]}
                onPress={cancelMultiSelect}
              >
                <Text style={styles.floatingButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.floatingButton, { backgroundColor: "#FFFFFF" }]}
                onPress={addSelectedFoodsToDiet}
              >
                <Feather name="check" size={18} color={colors.primary} />
                <Text
                  style={[styles.floatingButtonText, { color: colors.primary }]}
                >
                  Add to Diet
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
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
  content: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categories: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  customFoodSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  customFoodInput: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  foodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  foodCard: {
    width: "48%",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    position: "relative",
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  foodCardEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  foodCardName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  foodCardCalories: {
    fontSize: 12,
    marginBottom: 4,
  },
  foodCardMacros: {
    fontSize: 10,
    textAlign: "center",
  },
  summarySection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  categorySection: {
    marginTop: 16,
  },
  categoryHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  selectedFoodItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  selectedFoodEmoji: {
    fontSize: 32,
  },
  selectedFoodInfo: {
    flex: 1,
  },
  selectedFoodName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  selectedFoodCalories: {
    fontSize: 12,
  },
  availableFoodsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  availableFoodsButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  availableFoodsModal: {
    height: "80%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalScrollView: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  modalSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  addFoodSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addFoodHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  addFoodTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  foodInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 12,
  },
  categoryPickerRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  categoryPickerButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  categoryPickerText: {
    fontSize: 14,
    fontWeight: "600",
  },
  addFoodButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  addFoodButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  availableFoodsList: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
  },
  availableFoodItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  availableFoodEmoji: {
    fontSize: 32,
  },
  availableFoodInfo: {
    flex: 1,
  },
  availableFoodName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  availableFoodCategory: {
    fontSize: 12,
  },
  selectFoodButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  removeFoodButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  selectFoodsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
  },
  selectFoodsButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  categoryContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  categoryTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  categoryCalories: {
    fontSize: 16,
    fontWeight: "600",
  },
  selectedInCategory: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedFoodRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  recommendedRow: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 16,
  },
  recommendedCard: {
    width: 110,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    marginRight: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  recommendedEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  recommendedName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
    minHeight: 32,
  },
  recommendedCalories: {
    fontSize: 11,
    textAlign: "center",
  },
  nutritionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  nutritionInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 8,
  },
  availableFoodStats: {
    fontSize: 11,
    marginTop: 2,
  },
  dailySummaryCard: {
    margin: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  dailySummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dailySummaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  dailySummaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  mealsContainer: {
    paddingBottom: 20,
  },
  summaryCard: {
    marginTop: 12,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  caloriesBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFF5E6",
    borderRadius: 20,
  },
  caloriesText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF6B00",
  },
  selectedFoodsList: {
    gap: 8,
  },
  selectedFoodMacros: {
    fontSize: 12,
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
  emptyCard: {
    marginTop: 12,
    marginBottom: 16,
    padding: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  recommendedSection: {
    marginTop: 16,
  },
  recommendedLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  recommendedScrollContent: {
    paddingRight: 16,
  },
  recommendedCardSelected: {
    borderWidth: 2,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendedFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 4,
  },
  addIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  addMoreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modalHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  multiSelectButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  floatingActionBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingActionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  floatingActionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  floatingButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  floatingButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  addFoodDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 16,
    textAlign: "center",
  },
  customFoodForm: {
    gap: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#FFFFFF",
  },
  nutritionInputWrapper: {
    flex: 1,
  },
  nutritionLabel: {
    fontSize: 12,
    marginBottom: 6,
    color: "rgba(255, 255, 255, 0.8)",
  },
});
