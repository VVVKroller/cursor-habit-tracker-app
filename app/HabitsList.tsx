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
  Image,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Habit, DayItem, SetHabitsType, WeekDay } from "@/app/types";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  withSpring,
  FadeIn,
  withTiming,
  SlideOutUp,
  SlideInDown,
  FadeOut,
} from "react-native-reanimated";
import { VStack } from "@/components/ui/vstack";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { Calendar } from "./components/Calendar/Calendar";
import { WaterTracker } from "./components/WaterTracker/WaterTracker";
import { HabitItem } from "./components/HabitItem/HabitItem";
import { generateDatesRange, formatDateToYYYYMMDD } from "./utils/dateUtils";
import { habitsData } from "./data/habits";
import { HabitsToggle } from "./components/HabitsToggle/HabitsToggle";
import { colors } from "./utils/colors";
import { HabitEditModal } from "./components/HabitEditModal/HabitEditModal";
import { AddHabitMenu } from "./components/AddHabitMenu/AddHabitMenu";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigation } from "./components/Navigation/BottomNavigation";
import { StatusCircles } from "./components/StatusCircles/StatusCircles";
import { MotiView } from "moti";
import habitAdvice from "./utils/habitAdvice";

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

// Add this component for the modal
const WaterTrackerModal = ({
  visible,
  onClose,
  waterIntake,
  setWaterIntake,
  circlePosition,
}: {
  visible: boolean;
  onClose: () => void;
  waterIntake: number;
  setWaterIntake: (value: number | ((prev: number) => number)) => void;
  circlePosition: { x: number; y: number };
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <Animated.View
          entering={SlideInDown.duration(300).easing(
            Easing.bezier(0.2, 0, 0, 1)
          )}
          exiting={SlideOutUp.duration(200).easing(Easing.bezier(0.4, 0, 1, 1))}
          style={styles.modalContent}
        >
          <LinearGradient
            colors={[colors.surface.light, colors.surface.medium]}
            style={styles.gradient}
          >
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Water Tracker</Text>
                <Pressable style={styles.modalCloseButton} onPress={onClose}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={colors.text.secondary}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <WaterTracker
                waterIntake={waterIntake}
                setWaterIntake={setWaterIntake}
              />
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// Add this component before the HabitsList component
const HabitAdvice = ({ onClose }: { onClose: () => void }) => {
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * habitAdvice.length);
    setAdvice(habitAdvice[randomIndex]);
  }, []);

  return (
    <View style={styles.adviceContainer}>
      <LinearGradient
        colors={[colors.surface.medium, colors.surface.light]}
        style={styles.adviceGradient}
      >
        <Pressable style={styles.adviceCloseButton} onPress={onClose}>
          <Ionicons name="close" size={20} color={colors.primary[500]} />
        </Pressable>
        <View style={styles.adviceContent}>
          <Ionicons name="bulb-outline" size={24} color={colors.primary[500]} />
          <Text style={styles.adviceText}>{advice}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};
const allDates = generateDatesRange();

// Add this component after the WaterTrackerModal component
const DeleteConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  habitName,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  habitName: string;
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.deleteModalOverlay}
      >
        <Animated.View
          entering={SlideInDown.duration(300).easing(
            Easing.bezier(0.2, 0, 0, 1)
          )}
          exiting={SlideOutUp.duration(200).easing(Easing.bezier(0.4, 0, 1, 1))}
          style={styles.deleteModalContent}
        >
          <LinearGradient
            colors={[colors.surface.light, colors.surface.medium]}
            style={styles.deleteModalGradient}
          >
            <View style={styles.deleteModalHeader}>
              <View style={styles.deleteIconContainer}>
                <Ionicons
                  name="warning"
                  size={32}
                  color={colors.status.error}
                />
              </View>
              <Text style={styles.deleteModalTitle}>Delete Habit</Text>
              <Pressable
                style={styles.deleteModalCloseButton}
                onPress={onClose}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.text.secondary}
                />
              </Pressable>
            </View>

            <Text style={styles.deleteModalDescription}>
              Are you sure you want to delete "{habitName}"? This action cannot
              be undone.
            </Text>

            <View style={styles.deleteModalButtons}>
              <Pressable
                style={styles.deleteModalCancelButton}
                onPress={onClose}
              >
                <Text style={styles.deleteModalCancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.deleteModalConfirmButton}
                onPress={onConfirm}
              >
                <Text style={styles.deleteModalConfirmButtonText}>Delete</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default function HabitsList({
  habits,
  setHabits,
}: {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
}) {
  // Add navigation hook
  const navigation = useNavigation<NavigationProp>();
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
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [showGoodHabits, setShowGoodHabits] = useState<boolean>(true);
  const [waterIntake, setWaterIntake] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const selectedDay = allDates[selectedDayIndex];

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

  // Add a ref for tracking if initial scroll has happened
  const hasScrolledToToday = useRef(false);

  // Update the useEffect for initial animations and scroll
  useEffect(() => {
    listScale.value = withSpring(1, springConfig);
    listOpacity.value = withTiming(1, { duration: 500 });

    // Scroll to today's date if we haven't already
    if (
      scrollRef.current &&
      selectedDayIndex !== -1 &&
      !hasScrolledToToday.current
    ) {
      const screenWidth = Dimensions.get("window").width;
      const xOffset =
        selectedDayIndex * CALENDAR_ITEM_WIDTH -
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
  }, [selectedDayIndex]); // Add initialIndex as dependency

  function handleSelectDay(idx: number) {
    setSelectedDayIndex(idx);
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
    setHabits(
      habits.map((h) =>
        h.id === editingHabit.id ? { ...h, name: editingName } : h
      )
    );
    closeEditModal();
  }

  function handleWaterIntake() {
    setWaterIntake((prev) => (prev < 8 ? prev + 1 : prev));
  }

  // Обновим функцию toggleHabitCompletion
  function toggleHabitCompletion(habitId: string) {
    const formattedDate = formatDateToYYYYMMDD(selectedDay.fullDate);
    setHabits(
      habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              completionHistory: h.completionHistory?.includes(formattedDate)
                ? h.completionHistory.filter((date) => date !== formattedDate)
                : [...(h.completionHistory || []), formattedDate],
            }
          : h
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

  // Add state for steps
  const [steps, setSteps] = useState(6500);
  const [showWaterTracker, setShowWaterTracker] = useState(false);

  // Add state for circle position
  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });

  // Update the StatusCircles onWaterPress to include position
  const handleWaterPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setCirclePosition({ x: pageX, y: pageY });
    setShowWaterTracker(true);
  };

  // Получаем день недели из выбранной даты
  const getWeekDay = (date: Date): WeekDay => {
    const day = date.getDay();
    // Преобразуем из Sunday = 0 в Monday = 0
    return ((day + 6) % 7) as WeekDay;
  };

  // Add this function before the return statement
  const getHabitsForSelectedDayAndType = (
    habits: Habit[],
    selectedDate: Date,
    showGoodHabits: boolean
  ) => {
    const weekDay = getWeekDay(selectedDate);
    return habits.filter((habit) => {
      const isCorrectType = showGoodHabits
        ? habit.type === "good"
        : habit.type === "bad";
      const isScheduledForDay = habit.frequency.includes(weekDay);
      return isCorrectType && isScheduledForDay;
    });
  };

  // Update the empty state check in both return statements
  const habitsForSelectedDay = getHabitsForSelectedDayAndType(
    habits,
    selectedDay.fullDate,
    showGoodHabits
  );

  const [showAdvice, setShowAdvice] = useState(true);

  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  // Add this function to handle habit deletion
  const handleDeleteHabit = (habit: Habit) => {
    setHabitToDelete(habit);
  };

  const confirmDelete = () => {
    if (!habitToDelete) return;

    setHabits(habits.filter((h) => h.id !== habitToDelete.id));
    setHabitToDelete(null);
    // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (habitsForSelectedDay.length === 0) {
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
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>My Habits</Text>
              </View>
              <StatusCircles
                steps={steps}
                stepsGoal={10000}
                waterIntake={waterIntake}
                waterGoal={8}
                onWaterPress={handleWaterPress}
              />
            </View>

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

            {/* Empty State */}
            <View style={[styles.emptyContainer, { zIndex: 0 }]}>
              <VStack style={styles.emptyContent}>
                <Pressable
                  style={styles.emptyIconContainer}
                  onPress={() => setIsMenuOpen(true)}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={64}
                    color={colors.text.primary}
                  />
                </Pressable>
                <Text style={styles.emptyTitle}>
                  No {showGoodHabits ? "good" : "bad"} habits!
                </Text>
                <Text style={styles.emptyText}>
                  {showGoodHabits
                    ? "Add a good habit to start building positive routines"
                    : "Add a bad habit to start breaking negative patterns"}
                </Text>
              </VStack>
            </View>
          </View>
        </SafeAreaView>

        <BottomNavigation
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        />

        {/* Add menu component */}
        <AddHabitMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onAddGoodHabit={handleAddGoodHabit}
          onAddBadHabit={handleAddBadHabit}
        />

        {/* Add WaterTracker Modal */}
        <WaterTrackerModal
          visible={showWaterTracker}
          onClose={() => setShowWaterTracker(false)}
          waterIntake={waterIntake}
          setWaterIntake={setWaterIntake}
          circlePosition={circlePosition}
        />
      </LinearGradient>
    );
  }

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
          {/* Create a header container */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>My Habits</Text>
            </View>
            <StatusCircles
              steps={steps}
              stepsGoal={10000}
              waterIntake={waterIntake}
              waterGoal={8}
              onWaterPress={handleWaterPress}
            />
          </View>

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
            {habitsForSelectedDay.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onPress={() => toggleHabitCompletion(habit.id)}
                onEdit={() => handleEditHabit(habit)}
                onDelete={() => handleDeleteHabit(habit)}
                onToggleCompletion={() => toggleHabitCompletion(habit.id)}
                selectedDay={getWeekDay(selectedDay.fullDate)}
                selectedDate={selectedDay.fullDate}
              />
            ))}
            {habitsForSelectedDay.length > 0 && showAdvice && (
              <HabitAdvice onClose={() => setShowAdvice(false)} />
            )}
          </Animated.ScrollView>
        </View>
      </SafeAreaView>

      <BottomNavigation
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
      />

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

      {/* Add WaterTracker Modal */}
      <WaterTrackerModal
        visible={showWaterTracker}
        onClose={() => setShowWaterTracker(false)}
        waterIntake={waterIntake}
        setWaterIntake={setWaterIntake}
        circlePosition={circlePosition}
      />

      {/* Add Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={!!habitToDelete}
        onClose={() => setHabitToDelete(null)}
        onConfirm={confirmDelete}
        habitName={habitToDelete?.name || ""}
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  waterTrackerModal: {
    backgroundColor: colors.surface.strong,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: colors.border.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    display: "flex",
    width: "100%",
    
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface.medium,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 4,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
  },
  habitsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  habitsContainerContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyContent: {
    alignItems: "center",
    gap: 16,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface.medium,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.medium,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    padding: 24,
    paddingTop: 16,
    borderRadius: 20,
  },
  handle: {
    width: 32,
    height: 4,
    backgroundColor: colors.border.light,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.strong,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -4,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: colors.surface.strong,
    borderRadius: 16,
    padding: 16,
    fontSize: 17,
    color: colors.text.primary,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.text.secondary,
  },
  adviceContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  adviceGradient: {
    padding: 16,
  },
  adviceCloseButton: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 1,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  adviceContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  adviceText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  deleteModalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  deleteModalGradient: {
    padding: 24,
  },
  deleteModalHeader: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
    paddingTop: 16,
  },
  deleteIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.status.error}20`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  deleteModalCloseButton: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.medium,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  deleteModalDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  deleteModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  deleteModalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface.medium,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  deleteModalCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  deleteModalConfirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.status.error,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteModalConfirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
});
