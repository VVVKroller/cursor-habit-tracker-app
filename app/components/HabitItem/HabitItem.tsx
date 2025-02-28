import React from "react";
import { Text, Pressable, StyleSheet, View } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { Habit } from "@/app/types";
import { colors } from "../../utils/colors";
import { WeekDay } from "@/app/types";

interface HabitItemProps {
  habit: Habit;
  onPress: () => void;
  onEdit: () => void;
  onToggleCompletion: () => void;
  selectedDay: number;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HabitItem({ 
  habit, 
  onPress, 
  onEdit, 
  onToggleCompletion,
  selectedDay 
}: HabitItemProps) {
  const shouldShowHabit = habit.frequency.includes(selectedDay as WeekDay);

  if (!shouldShowHabit) {
    return null;
  }

  const handleToggle = React.useCallback(() => {
    onToggleCompletion();
  }, [onToggleCompletion]);

  const handleEdit = React.useCallback((e: any) => {
    e.stopPropagation();
    onEdit();
  }, [onEdit]);

  return (
    <Pressable
      onPress={handleToggle}
      style={[styles.habitItem, habit.isCompleted && styles.habitItemCompleted]}
    >
      <HStack style={styles.habitContent}>
        <Pressable style={styles.checkbox} onPress={handleToggle}>
          {habit.isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>
        <VStack style={styles.habitInfo}>
          <Text style={styles.habitName}>{habit.name}</Text>
          <HStack style={styles.daysContainer}>
            {WEEKDAYS.map((day, index) => (
              <View
                key={day}
                style={[
                  styles.dayCircle,
                  habit.frequency.includes(index as WeekDay) && styles.dayCircleSelected
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    habit.frequency.includes(index as WeekDay) && styles.dayTextSelected
                  ]}
                >
                  {day}
                </Text>
              </View>
            ))}
          </HStack>
        </VStack>
        <Pressable
          onPress={handleEdit}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>⋮</Text>
        </Pressable>
      </HStack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  habitItem: {
    backgroundColor: colors.surface.light,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  habitContent: {
    padding: 16,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: colors.surface.light,
  },
  checkmark: {
    color: "#8B5CF6",
    fontSize: 16,
    fontWeight: "bold",
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    letterSpacing: 0.3,
  },
  habitFrequency: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  habitItemCompleted: {
    backgroundColor: `${colors.primary[500]}25`,
    borderColor: colors.primary[500],
    borderWidth: 1,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: colors.text.primary,
    fontSize: 20,
    lineHeight: 24,
  },
  daysContainer: {
    marginTop: 8,
    gap: 2,
  },
  dayCircle: {
    width: 32,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.medium,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  dayCircleSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  dayTextSelected: {
    color: colors.text.primary,
  },
});
