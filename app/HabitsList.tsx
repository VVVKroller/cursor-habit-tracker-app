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
import * as Haptics from "expo-haptics";
import { Calendar } from "./components/Calendar/Calendar";
import { WaterTracker } from "./components/WaterTracker/WaterTracker";
import { HabitItem } from "./components/HabitItem/HabitItem";
import { generateDatesRange } from "./utils/dateUtils";
import { habitsData } from "./data/habits";
import { HabitsToggle } from "./components/HabitsToggle/HabitsToggle";
import { colors } from "./utils/colors";
import { HabitEditModal } from "./components/HabitEditModal/HabitEditModal";
import { AddHabitMenu } from "./components/AddHabitMenu/AddHabitMenu";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigation } from "./components/Navigation/BottomNavigation";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CALENDAR_ITEM_WIDTH = SCREEN_WIDTH / 7;

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
  AddHabit: {
    type: "good" | "bad";
  };
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
  const [waterIntake, setWaterIntake] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const scrollY = useSharedValue(0);
  const listScale = useSharedValue(0.8);
  const listOpacity = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Add animated styles
  const listAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: listScale.value }],
    opacity: listOpacity.value,
  }));

  // Filter habits based on type
  const filteredHabits = React.useMemo(
    () =>
      habits.filter(
        (habit) => habit.type === (showGoodHabits ? "good" : "bad")
      ),
    [habits, showGoodHabits]
  );

  // Add a ref for tracking if initial scroll has happened
  const hasScrolledToToday = useRef(false);

  // Update the useEffect for initial animations and scroll
  useEffect(() => {
    listScale.value = withSpring(1, springConfig);
    listOpacity.value = withTiming(1, { duration: 500 });

    // Scroll to today's date if we haven't already
    if (
      scrollRef.current &&
      initialIndex !== -1 &&
      !hasScrolledToToday.current
    ) {
      const screenWidth = Dimensions.get("window").width;
      const xOffset =
        initialIndex * CALENDAR_ITEM_WIDTH -
        screenWidth / 2 +
        CALENDAR_ITEM_WIDTH / 2;

      // Use requestAnimationFrame to ensure the scroll happens after layout
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          x: xOffset > 0 ? xOffset : 0,
          animated: true,
        });
        hasScrolledToToday.current = true;
      });
    }
  }, [initialIndex]); // Add initialIndex as dependency

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

  // Add state for menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add handlers
  const handleAddGoodHabit = () => {
    setIsMenuOpen(false);
    navigation.navigate("AddHabit", { type: "good" });
  };

  const handleAddBadHabit = () => {
    setIsMenuOpen(false);
    navigation.navigate("AddHabit", { type: "bad" });
  };

  return (
    <LinearGradient
      colors={[
        colors.gradient.start,
        colors.gradient.middle,
        colors.gradient.end,
      ]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Calendar
            allDates={allDates}
            selectedDayIndex={selectedDayIndex}
            onSelectDay={handleSelectDay}
            scrollRef={scrollRef}
          />

          <HabitsToggle
            showGoodHabits={showGoodHabits}
            onToggle={setShowGoodHabits}
          />

          <Animated.ScrollView
            style={[styles.habitsContainer, listAnimatedStyle]}
            contentContainerStyle={styles.habitsContainerContent}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
          >
            {filteredHabits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onPress={() => openHabitDetails(habit)}
                onEdit={() => handleEditHabit(habit)}
                onToggleCompletion={() => toggleHabitCompletion(habit.id)}
              />
            ))}

            <WaterTracker
              waterIntake={waterIntake}
              setWaterIntake={setWaterIntake}
            />
          </Animated.ScrollView>
        </View>
      </SafeAreaView>

      <BottomNavigation
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
      />

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

      <HabitEditModal
        visible={!!editingHabit}
        onClose={closeEditModal}
        onSave={saveEdit}
        habitName={editingName}
        onChangeHabitName={setEditingName}
      />

      {/* Add menu component */}
      <AddHabitMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onAddGoodHabit={handleAddGoodHabit}
        onAddBadHabit={handleAddBadHabit}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  calendarContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 20,
    marginHorizontal: 10,
    backdropFilter: "blur(10px)",
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
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  calendarItemSelected: {
    backgroundColor: "#8B5CF6",
    transform: [{ scale: 1.05 }],
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 15,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
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
    backgroundColor: "rgba(30, 27, 75, 0.95)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
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
    color: "#FFFFFF",
    marginBottom: 16,
  },
  modalDays: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
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
    backgroundColor: "#8B5CF6",
    borderRadius: 4,
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
    backgroundColor: "rgba(255, 255, 255, 0.08)",
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
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
    alignItems: "center",
  },
  filterLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    marginRight: 10,
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
    paddingTop: 8,
    paddingBottom: 20,
    gap: 12,
  },
  habitContent: {
    padding: 16,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  checkmark: {
    color: "#8B5CF6",
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
    backgroundColor: "rgba(139, 92, 246, 0.15)",
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
    zIndex: 2,
  },
  navButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginTop: -20,
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 3,
  },
});
