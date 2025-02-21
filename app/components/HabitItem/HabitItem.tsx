import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { Habit } from "@/app/types";
import { colors } from "../../utils/colors";

interface HabitItemProps {
  habit: Habit;
  onPress: () => void;
  onEdit: () => void;
  onToggleCompletion: () => void;
}

export const HabitItem = React.memo(function HabitItem({
  habit,
  onPress,
  onEdit,
  onToggleCompletion,
}: HabitItemProps) {
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
          <Text style={styles.habitFrequency}>
            {habit.frequency === "daily" ? "Daily" : "Weekly"}
          </Text>
        </VStack>
        <Pressable
          onPress={handleEdit}
          style={styles.editButton}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </Pressable>
      </HStack>
    </Pressable>
  );
});

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
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});
