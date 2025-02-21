import React from "react";
import { StyleSheet, Pressable, Text, Animated } from "react-native";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Ionicons } from "@expo/vector-icons";
import { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { colors } from "../../utils/colors";

interface HabitsToggleProps {
  showGoodHabits: boolean;
  onToggle: (value: boolean) => void;
}

export function HabitsToggle({ showGoodHabits, onToggle }: HabitsToggleProps) {
  return (
    <Box style={styles.container}>
      <HStack style={styles.toggleContainer}>
        <Pressable
          style={[
            styles.toggleButton,
            showGoodHabits && styles.toggleButtonActive,
          ]}
          onPress={() => onToggle(true)}
        >
          <Ionicons
            name="sunny"
            size={20}
            color={showGoodHabits ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)"}
            style={styles.icon}
          />
          <Text
            style={[
              styles.toggleText,
              showGoodHabits && styles.toggleTextActive,
            ]}
          >
            Good Habits
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.toggleButton,
            !showGoodHabits && styles.toggleButtonActive,
          ]}
          onPress={() => onToggle(false)}
        >
          <Ionicons
            name="moon"
            size={20}
            color={!showGoodHabits ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)"}
            style={styles.icon}
          />
          <Text
            style={[
              styles.toggleText,
              !showGoodHabits && styles.toggleTextActive,
            ]}
          >
            Bad Habits
          </Text>
        </Pressable>
      </HStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 8,
    borderRadius: 20,
    backgroundColor: colors.surface.light,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary[500],
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    marginRight: 4,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.tertiary,
  },
  toggleTextActive: {
    color: colors.text.primary,
  },
});
