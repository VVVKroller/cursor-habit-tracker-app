import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { BottomNavigation } from "../components/Navigation/BottomNavigation";
import { StatusCircles } from "../components/StatusCircles/StatusCircles";
import { Calendar } from "../components/Calendar/Calendar";
import { generateDatesRange } from "../utils/dateUtils";
import { Habit, WeekDay } from "../types";

interface AnalyticsScreenProps {
  habits: Habit[];
  waterIntake: number;
  steps: number;
}

export default function AnalyticsScreen({
  habits,
  waterIntake,
  steps,
}: AnalyticsScreenProps) {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const allDates = generateDatesRange();

  // Get habits for selected day
  const habitsForSelectedDay = useMemo(() => {
    const dayOfWeek = selectedDate.getDay() as WeekDay;
    const dateString = selectedDate.toISOString().split("T")[0]; // "YYYY-MM-DD"

    return habits
      .filter((habit) => {
        // Check if habit is scheduled for this day of week
        const isScheduledToday = habit.frequency.includes(dayOfWeek);

        return isScheduledToday;
      })
      .map((habit) => ({
        ...habit,
        isCompleted: habit.completionHistory?.includes(dateString) ?? false,
      }));
  }, [habits, selectedDate]);

  const completionRate =
    habitsForSelectedDay.length > 0
      ? (habitsForSelectedDay.filter((h) => h.isCompleted).length /
          habitsForSelectedDay.length) *
        100
      : 0;

  return (
    <LinearGradient
      colors={[
        colors.gradient.start,
        colors.gradient.middle,
        colors.gradient.end,
      ]}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.calendarContainer}>
            <Calendar
              allDates={allDates}
              selectedDayIndex={allDates.findIndex(
                (date) =>
                  date.fullDate.toDateString() === selectedDate.toDateString()
              )}
              onSelectDay={(index) => setSelectedDate(allDates[index].fullDate)}
              scrollRef={React.useRef(null)}
            />
          </View>

          <View style={styles.habitsContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>
                {Math.round(completionRate)}%
              </Text>
              <Text style={styles.progressLabel}>Completed</Text>
            </View>

            {habitsForSelectedDay.map((habit) => (
              <View key={habit.id} style={styles.habitItem}>
                <View
                  style={[
                    styles.habitStatus,
                    {
                      backgroundColor: habit.isCompleted
                        ? colors.status.success
                        : colors.status.error,
                    },
                  ]}
                >
                  <Ionicons
                    name={habit.isCompleted ? "checkmark" : "close"}
                    size={20}
                    color="white"
                  />
                </View>
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.habitType}>
                    {habit.type === "good" ? "Good Habit" : "Bad Habit"}
                  </Text>
                </View>
              </View>
            ))}

            {habitsForSelectedDay.length === 0 && (
              <Text style={styles.emptyText}>
                No habits scheduled for this day
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomNavigation />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  statsContainer: {
    padding: 20,
  },
  habitsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 16,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface.medium,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  progressText: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.surface.medium,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  habitStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
  habitType: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    color: colors.text.secondary,
    fontSize: 16,
    marginTop: 20,
  },
});
