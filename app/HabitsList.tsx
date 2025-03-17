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
import { Habit, DayItem, WeekDay } from "@/app/types";
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
import { generateDatesRange } from "./utils/dateUtils";
import { habitsData } from "./data/habits";
import { HabitsToggle } from "./components/HabitsToggle/HabitsToggle";
import { colors } from "./utils/colors";
import { HabitEditModal } from "./components/HabitEditModal/HabitEditModal";
import { AddHabitMenu } from "./components/AddHabitMenu/AddHabitMenu";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigation } from "./components/Navigation/BottomNavigation";
import { StatusCircles } from "./components/StatusCircles/StatusCircles";
import { MotiView } from "moti";
import { useDatabase } from "./hooks/useDatabase";
import { useAuth } from "./context/AuthContext";
import { styles } from "./styles/HabitsList.styles";

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

// Обновим тип для setHabits
type SetHabitsType = React.Dispatch<React.SetStateAction<Habit[]>>;

export default function HabitsList() {
  const { user } = useAuth();
  const { habits, loading, error, completeHabit, skipHabit } = useDatabase(
    user?.uid || null
  );

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
    // This function needs to be updated to use the database
  }

  function handleWaterIntake() {
    setWaterIntake((prev) => (prev < 8 ? prev + 1 : prev));
  }

  async function toggleHabitCompletion(habitId: string) {
    const selectedDate = allDates[selectedDayIndex].fullDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
      // For today's habits, toggle completion
      const success = await completeHabit(habitId);
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else if (selectedDate < today) {
      // For past habits, mark as skipped
      const success = await skipHabit(habitId, selectedDate);
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading habits...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (filteredHabits.length === 0) {
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
                <View style={styles.emptyIconContainer}>
                  <Ionicons
                    name="add-circle-outline"
                    size={64}
                    color={colors.text.primary}
                  />
                </View>
                <Text style={styles.emptyTitle}>No habits yet</Text>
                <Text style={styles.emptyText}>
                  Start building better habits by adding your first one
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
            {filteredHabits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onPress={() => toggleHabitCompletion(habit.id)}
                onEdit={() => handleEditHabit(habit)}
                onToggleCompletion={() => toggleHabitCompletion(habit.id)}
                selectedDay={getWeekDay(allDates[selectedDayIndex].fullDate)}
              />
            ))}
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
    </LinearGradient>
  );
}
