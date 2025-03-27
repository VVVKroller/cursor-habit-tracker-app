import React, { useState } from "react";
import { Text, Pressable, StyleSheet, View, Modal } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { Habit } from "@/app/types";
import { colors } from "../../utils/colors";
import { WeekDay } from "@/app/types";
import { formatDateToYYYYMMDD } from "@/app/utils/dateUtils";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutUp,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface HabitItemProps {
  habit: Habit;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleCompletion: () => void;
  selectedDay: number;
  selectedDate: Date;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HabitItem({
  habit,
  onPress,
  onEdit,
  onDelete,
  onToggleCompletion,
  selectedDay,
  selectedDate,
}: HabitItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const shouldShowHabit = habit.frequency.includes(selectedDay as WeekDay);

  if (!shouldShowHabit) {
    return null;
  }

  const handleToggle = React.useCallback(() => {
    onToggleCompletion();
  }, [onToggleCompletion]);

  const handleEdit = React.useCallback(
    (e: any) => {
      e.stopPropagation();
      setShowMenu(false);
      onEdit();
    },
    [onEdit]
  );

  const handleDelete = React.useCallback(
    (e: any) => {
      e.stopPropagation();
      setShowMenu(false);
      onDelete();
    },
    [onDelete]
  );

  const isCompleted = habit.completionHistory?.includes(
    formatDateToYYYYMMDD(selectedDate)
  );

  return (
    <>
      <Pressable
        onPress={handleToggle}
        style={[styles.habitItem, isCompleted && styles.habitItemCompleted]}
      >
        <HStack style={styles.habitContent}>
          {!isCompleted ? (
            <View style={styles.checkbox} />
          ) : (
            <Text>{habit.avatar}</Text>
          )}
          <VStack style={styles.habitInfo}>
            <Text style={styles.habitName}>{habit.name}</Text>
            <HStack style={styles.daysContainer}>
              {WEEKDAYS.map((day, index) => (
                <View
                  key={day}
                  style={[
                    styles.dayCircle,
                    habit.frequency.includes(index as WeekDay) &&
                      styles.dayCircleSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      habit.frequency.includes(index as WeekDay) &&
                        styles.dayTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              ))}
            </HStack>
          </VStack>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              setShowMenu(true);
            }}
            style={styles.editButton}
            hitSlop={8}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={colors.text.secondary}
            />
          </Pressable>
        </HStack>
      </Pressable>

      <Modal
        visible={showMenu}
        transparent
        statusBarTranslucent
        animationType="none"
        onRequestClose={() => setShowMenu(false)}
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
            exiting={SlideOutUp.duration(200).easing(
              Easing.bezier(0.4, 0, 1, 1)
            )}
            style={styles.menuContent}
          >
            <LinearGradient
              colors={[colors.surface.light, colors.surface.medium]}
              style={styles.menuGradient}
            >
              <View style={styles.handle} />
              <Pressable style={styles.menuItem} onPress={handleEdit}>
                <Ionicons
                  name="pencil-outline"
                  size={20}
                  color={colors.text.primary}
                />
                <Text style={styles.menuText}>Edit</Text>
              </Pressable>
              <Pressable
                style={[styles.menuItem, styles.deleteMenuItem]}
                onPress={handleDelete}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={colors.status.error}
                />
                <Text style={[styles.menuText, styles.deleteText]}>Delete</Text>
              </Pressable>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
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
    color: colors.primary[500],
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
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  daysContainer: {
    marginTop: 8,
    gap: 2,
  },
  dayCircle: {
    width: 32,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "500",
    color: colors.text.secondary,
  },
  dayTextSelected: {
    color: colors.text.primary,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  menuContent: {
    backgroundColor: colors.surface.medium,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  menuGradient: {
    padding: 16,
    paddingBottom: 32,
  },
  handle: {
    width: 32,
    height: 4,
    backgroundColor: colors.border.light,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  deleteMenuItem: {
    marginTop: 8,
  },
  deleteText: {
    color: colors.status.error,
  },
});
