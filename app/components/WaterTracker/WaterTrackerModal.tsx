import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../utils/colors";
import { WaterTracker } from "./WaterTracker";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CIRCLE_SIZE = 60;

interface WaterTrackerModalProps {
  visible: boolean;
  onClose: () => void;
  waterIntake: number;
  setWaterIntake: (value: number | ((prev: number) => number)) => void;
  circlePosition: { x: number; y: number };
}

export function WaterTrackerModal({
  visible,
  onClose,
  waterIntake,
  setWaterIntake,
  circlePosition,
}: WaterTrackerModalProps) {
  const [animationProgress, setAnimationProgress] = React.useState(0);

  useEffect(() => {
    setAnimationProgress(visible ? 1 : 0);
  }, [visible]);

  const maxRadius = Math.sqrt(
    Math.pow(SCREEN_WIDTH, 2) + Math.pow(SCREEN_HEIGHT, 2)
  );

  const containerStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationProgress,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );

    const radius = interpolate(
      animationProgress,
      [0, 1],
      [CIRCLE_SIZE / 2, maxRadius],
      Extrapolate.CLAMP
    );

    return {
      position: "absolute",
      top: circlePosition.y - radius,
      left: circlePosition.x - radius,
      width: radius * 2,
      height: radius * 2,
      borderRadius: radius,
      backgroundColor: colors.surface.strong,
      transform: [{ scale }],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress,
      [0.5, 1],
      [0, 1],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      animationProgress,
      [0.5, 1],
      [0.8, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  if (!visible && animationProgress === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View style={[styles.modalContainer, containerStyle]}>
          <LinearGradient
            colors={[
              colors.gradient.start,
              colors.gradient.middle,
              colors.gradient.end,
            ]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Pressable>
      <Animated.View style={[styles.content, contentStyle]}>
        <View style={styles.waterTrackerModal}>
          <View style={styles.header}>
            <Text style={styles.title}>Water Tracker</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text.secondary} />
            </Pressable>
          </View>
          <View style={styles.trackerContainer}>
            <WaterTracker
              waterIntake={waterIntake}
              setWaterIntake={setWaterIntake}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
    backgroundColor: colors.surface.strong,
  },
  gradient: {
    padding: 24,
    paddingTop: 16,
  },
  handle: {
    width: 32,
    height: 4,
    backgroundColor: colors.border.light,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
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
  saveButton: {
    backgroundColor: colors.primary[500],
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: colors.surface.strong,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
  cancelButtonText: {
    color: colors.text.secondary,
  },
});
