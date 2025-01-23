import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Dimensions,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Habit, DayItem } from "@/app/types";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { VStack } from "@/components/ui/vstack";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CALENDAR_ITEM_WIDTH = SCREEN_WIDTH / 7;

function generateDatesRange() {
  const result = [];
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 15);
  const end = new Date(now);
  end.setDate(end.getDate() + 15);
  let current = new Date(start);
  while (current <= end) {
    const dateStr =
      current.toDateString().slice(0, 3) + " " + current.getDate();
    result.push({
      fullDate: new Date(current),
      label: dateStr,
    });
    current.setDate(current.getDate() + 1);
  }
  return result;
}

const habitsData: Habit[] = [
  {
    id: 1,
    name: "Morning Yoga",
    daysCompleted: 42,
    description: "Йога по утрам уже стала образом жизни!",
    type: "good",
    frequency: "daily",
  },
  {
    id: 2,
    name: "Drink Green Tea",
    daysCompleted: 10,
    description: "Зелёный чай вместо утреннего кофе.",
    type: "good",
    frequency: "daily",
  },
  {
    id: 3,
    name: "Read 30 min",
    daysCompleted: 7,
    description: "Читаю художественную литературу перед сном.",
    type: "good",
    frequency: "daily",
  },
  {
    id: 4,
    name: "Walk 10,000 Steps",
    daysCompleted: 21,
    description: "Стараюсь каждый день достигать 10к шагов!",
    type: "good",
    frequency: "daily",
  },
  {
    id: 5,
    name: "Smoking",
    daysCompleted: 0,
    description: "Бросаю курить, держусь уже неделю!",
    type: "bad",
    frequency: "daily",
  },
  {
    id: 6,
    name: "Late Night Snacks",
    daysCompleted: 3,
    description: "Стараюсь не есть после 8 вечера.",
    type: "bad",
    frequency: "daily",
  },
  {
    id: 7,
    name: "Social Media",
    daysCompleted: 5,
    description: "Уменьшаю время в соцсетях до 1 часа в день.",
    type: "bad",
    frequency: "daily",
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Define your navigation param list type
type RootStackParamList = {
  settings: undefined;
  Home: undefined;
  AddHabit: undefined;
  // ... other screens
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const springConfig = {
  damping: 10,
  stiffness: 100,
  mass: 1,
};

export default function HabitsList() {
  // Add navigation hook
  const navigation = useNavigation<NavigationProp>();
  const allDates = generateDatesRange();
  const now = new Date();
  const initialIndex = allDates.findIndex((item) => {
    return (
      item.fullDate.getFullYear() === now.getFullYear() &&
      item.fullDate.getMonth() === now.getMonth() &&
      item.fullDate.getDate() === now.getDate()
    );
  });
  const [selectedDayIndex, setSelectedDayIndex] =
    useState<number>(initialIndex);
  const [habits, setHabits] = useState<Habit[]>(habitsData);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [showGoodHabits, setShowGoodHabits] = useState<boolean>(true);
  const scrollRef = useRef<ScrollView>(null);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const calendarAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.9],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  // Add animation values
  const listScale = useSharedValue(0.8);
  const listOpacity = useSharedValue(0);

  // Add useEffect for initial animations
  useEffect(() => {
    listScale.value = withSpring(1, springConfig);
    listOpacity.value = withTiming(1, { duration: 500 });

    // Scroll to today's date
    if (scrollRef.current && initialIndex !== -1) {
      setTimeout(() => {
        const screenWidth = Dimensions.get("window").width;
        const xOffset =
          initialIndex * CALENDAR_ITEM_WIDTH -
          screenWidth / 2 +
          CALENDAR_ITEM_WIDTH / 2;
        scrollRef.current?.scrollTo({
          x: xOffset > 0 ? xOffset : 0,
          animated: true,
        });
      }, 100);
    }
  }, []);

  // Add animated styles
  const listAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: listScale.value }],
    opacity: listOpacity.value,
  }));

  const filteredHabits = React.useMemo(
    () =>
      habits.filter(
        (habit) => habit.type === (showGoodHabits ? "good" : "bad")
      ),
    [habits, showGoodHabits]
  );

  function handleSelectDay(idx: number) {
    setSelectedDayIndex(idx);
    const shuffled = shuffleArray([...habits]);
    setHabits(shuffled);
  }

  function openHabitDetails(habit: Habit) {
    setSelectedHabit(habit);
  }

  function closeModal() {
    setSelectedHabit(null);
  }

  function handleEditHabit(habit: Habit) {
    setEditingHabit(habit);
    setEditingName(habit.name);
  }

  function closeEditModal() {
    setEditingHabit(null);
    setEditingName("");
  }

  function saveEdit() {
    if (!editingHabit) return;
    setHabits((prevHabits) =>
      prevHabits.map((h) =>
        h.id === editingHabit.id ? { ...h, name: editingName } : h
      )
    );
    closeEditModal();
  }

  const [waterIntake, setWaterIntake] = useState(0);

  function handleWaterIntake() {
    setWaterIntake((prev) => (prev < 8 ? prev + 1 : prev));
  }

  function toggleHabitCompletion(habitId: number) {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId
          ? { ...habit, isCompleted: !habit.isCompleted }
          : habit
      )
    );
  }

  return (
    <LinearGradient
      colors={["#1a237e", "#283593", "#3949ab"]}
      style={styles.container}
    >
      <Box style={styles.calendarContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarContent}
        >
          {allDates.map((item, idx) => {
            const isSelected = idx === selectedDayIndex;
            return (
              <Pressable
                key={item.label}
                onPress={() => handleSelectDay(idx)}
                style={[
                  styles.calendarItem,
                  isSelected && styles.calendarItemSelected,
                ]}
              >
                <Text style={styles.calendarDay}>
                  {item.label.split(" ")[0]}
                </Text>
                <Text
                  style={[
                    styles.calendarDate,
                    isSelected && styles.calendarDateSelected,
                  ]}
                >
                  {item.label.split(" ")[1]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Box>

      <HStack style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Show:</Text>
        <Switch value={showGoodHabits} onValueChange={setShowGoodHabits} />
        <Text style={styles.filterText}>
          {showGoodHabits ? "Good Habits" : "Bad Habits"}
        </Text>
      </HStack>

      <Animated.ScrollView
        style={[styles.habitsContainer, listAnimatedStyle]}
        contentContainerStyle={styles.habitsContainerContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredHabits.map((habit) => (
          <Pressable
            key={habit.id}
            onPress={() => openHabitDetails(habit)}
            style={[
              styles.habitItem,
              habit.isCompleted && styles.habitItemCompleted,
            ]}
          >
            <HStack style={styles.habitContent}>
              <Pressable
                style={styles.checkbox}
                onPress={() => toggleHabitCompletion(habit.id)}
              >
                {habit.isCompleted && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
              <VStack style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.habitFrequency}>
                  {habit.frequency === "daily" ? "Daily" : "Weekly"}
                </Text>
              </VStack>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  handleEditHabit(habit);
                }}
                style={styles.editButton}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color="#FFFFFF"
                />
              </Pressable>
            </HStack>
          </Pressable>
        ))}

        <Box style={styles.waterTrackerContainer}>
          <HStack style={styles.waterTrackerHeader}>
            <Text style={styles.waterTrackerTitle}>Water Intake</Text>
            <Text style={styles.waterTrackerSubtitle}>Daily Goal: 2L</Text>
          </HStack>

          <View style={styles.waterProgressContainer}>
            <Animated.View
              style={[
                styles.waterProgress,
                {
                  width: withSpring(`${(waterIntake / 8) * 100}%`, {
                    damping: 15,
                    stiffness: 100
                  }),
                },
              ]}
            />
          </View>

          <HStack style={styles.waterGlassesContainer}>
            {[...Array(8)].map((_, index) => (
              <Pressable
                key={index}
                onPress={() => setWaterIntake(index + 1)}
                style={({ pressed }) => [
                  styles.waterGlass,
                  pressed && { transform: [{ scale: 0.95 }] }
                ]}
              >
                <Ionicons
                  name={index < waterIntake ? "water" : "water-outline"}
                  size={28}
                  color={index < waterIntake ? "#60A5FA" : "#94A3B8"}
                  style={styles.waterIcon}
                />
              </Pressable>
            ))}
          </HStack>

          <HStack style={styles.waterControls}>
            <Pressable
              style={styles.waterControlButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setWaterIntake((prev) => Math.max(0, prev - 1));
              }}
            >
              <Ionicons name="remove" size={24} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.waterAmount}>{waterIntake} / 8 glasses</Text>
            <Pressable
              style={styles.waterControlButton}
              onPress={() => setWaterIntake((prev) => Math.min(8, prev + 1))}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </Pressable>
          </HStack>
        </Box>
      </Animated.ScrollView>

      <HStack style={styles.navigationContainer}>
        <Pressable style={styles.navButton} onPress={() => console.log("Home")}>
          <Ionicons name="home" size={24} color="#FFF" />
        </Pressable>
        <Pressable
          style={styles.navButton}
          onPress={() => navigation.navigate("AddHabit")}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </Pressable>
        <Pressable
          style={styles.navButton}
          onPress={() => navigation.navigate("settings")}
        >
          <Ionicons name="person" size={24} color="#FFF" />
        </Pressable>
      </HStack>

      {/* Details Modal */}
      <Modal
        visible={!!selectedHabit}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedHabit?.name}</Text>
            <Text style={styles.modalDays}>
              Completed: {selectedHabit?.daysCompleted} days
            </Text>
            <Text style={styles.modalDescription}>
              {selectedHabit?.description}
            </Text>
            <Pressable onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={!!editingHabit}
        transparent
        animationType="slide"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Habit</Text>
            <TextInput
              style={styles.editInput}
              value={editingName}
              onChangeText={setEditingName}
              placeholder="Habit name"
            />
            <View style={styles.modalButtons}>
              <Pressable onPress={saveEdit} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
              <Pressable onPress={closeEditModal} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  contentContainer: {
    flex: 1,
    position: "relative",
  },
  calendarContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  calendarContent: {
    alignItems: "center",
  },
  calendarItem: {
    width: 65,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  calendarItemSelected: {
    backgroundColor: "#4CAF50",
    transform: [{ scale: 1.05 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarDay: {
    color: "#FFFFFF",
    fontSize: 12,
    opacity: 0.7,
  },
  calendarDate: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  calendarDateSelected: {
    color: "#FFFFFF",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 20,
  },
  toggleLabel: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  toggleType: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  habitsList: {
    flex: 1,
    marginBottom: 180,
  },
  habitsListContent: {
    paddingHorizontal: 10,
  },
  habitItem: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 15,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  habitItemContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 15,
    justifyContent: "space-between",
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  habitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  habitIcon: {
    fontSize: 24,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  bigAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 16,
  },
  modalDays: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: "#334155",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeButtonCancel: {
    backgroundColor: "#EF4444",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editInput: {
    width: "100%",
    height: 50,
    borderColor: "#CBD5E1",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  waterTrackerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  waterTrackerHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  waterTrackerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  waterTrackerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  waterProgressContainer: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    marginBottom: 20,
    overflow: "hidden",
  },
  waterProgress: {
    height: "100%",
    backgroundColor: "#60A5FA",
    borderRadius: 4,
    transition: "width 0.3s ease",
  },
  waterGlassesContainer: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  waterGlass: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1 }],
    transition: "transform 0.2s",
  },
  waterIcon: {
    transform: [{ translateY: 2 }],
  },
  waterControls: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  waterControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#60A5FA",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    pressable: {
      opacity: 0.8,
      transform: [{ scale: 0.95 }],
    }
  },
  waterAmount: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 100,
  },
  filterContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 20,
    padding: 12,
  },
  filterLabel: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  filterText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  habitsContainer: {
    flex: 1,
  },
  habitsContainerContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  habitContent: {
    padding: 16,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  checkmark: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
  habitInfo: {
    flex: 1,
  },
  habitFrequency: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
  },
  habitItemCompleted: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  navigationContainer: {
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backdropFilter: "blur(10px)",
  },
  navButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
