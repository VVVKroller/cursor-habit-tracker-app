import React from "react";
import { StyleSheet, Pressable, Dimensions, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../../utils/colors";
import { BlurView } from "expo-blur";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface AddHabitMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoodHabit: () => void;
  onAddBadHabit: () => void;
}

export function AddHabitMenu({
  isOpen,
  onClose,
  onAddGoodHabit,
  onAddBadHabit,
}: AddHabitMenuProps) {
  const springConfig = {
    damping: 12,
    mass: 0.8,
    stiffness: 100,
  };

  const menuItemStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isOpen ? 1 : 0, springConfig),
        },
        {
          translateY: withSpring(isOpen ? -100 : 0, springConfig),
        },
      ],
      opacity: withSpring(isOpen ? 1 : 0, springConfig),
    };
  });

  const menuItem2Style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isOpen ? 1 : 0, springConfig),
        },
        {
          translateY: withSpring(isOpen ? -200 : 0, springConfig),
        },
      ],
      opacity: withSpring(isOpen ? 1 : 0, springConfig),
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
      pointerEvents: isOpen ? "auto" : "none",
    };
  });

  return (
    <>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        <Pressable style={styles.overlayPress} onPress={onClose} />
      </Animated.View>
      <View style={styles.container}>
        <Animated.View style={[styles.menuItemContainer, menuItem2Style]}>
          <Pressable
            style={[styles.menuButton, styles.goodHabitButton]}
            onPress={onAddGoodHabit}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="sunny" size={28} color={colors.text.primary} />
            </View>
            <Text style={styles.menuLabel}>Good Habit</Text>
            <Text style={styles.menuDescription}>Track positive behaviors</Text>
          </Pressable>
        </Animated.View>
        <Animated.View style={[styles.menuItemContainer, menuItemStyle]}>
          <Pressable
            style={[styles.menuButton, styles.badHabitButton]}
            onPress={onAddBadHabit}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="moon" size={28} color={colors.text.primary} />
            </View>
            <Text style={styles.menuLabel}>Bad Habit</Text>
            <Text style={styles.menuDescription}>Break negative patterns</Text>
          </Pressable>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1,
  },
  overlayPress: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    width: SCREEN_WIDTH - 48,
    height: 200,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 2,
  },
  menuItemContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
  },
  menuButton: {
    width: "100%",
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(30, 27, 75, 0.95)",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  goodHabitButton: {
    borderColor: colors.status.success + "80",
    backgroundColor: colors.status.success + "30",
  },
  badHabitButton: {
    borderColor: colors.status.error + "80",
    backgroundColor: colors.status.error + "30",
  },
  menuLabel: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  menuDescription: {
    position: "absolute",
    left: 80,
    bottom: 16,
    color: colors.text.secondary,
    fontSize: 13,
  },
});
