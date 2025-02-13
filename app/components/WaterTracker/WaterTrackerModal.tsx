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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    overflow: "hidden",
  },
  waterTrackerModal: {
    backgroundColor: colors.surface.strong,
    borderRadius: 32,
    padding: 24,
    width: "90%",
    maxWidth: 500,
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "auto",
    borderWidth: 1,
    borderColor: colors.border.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 24,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface.medium,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  trackerContainer: {
    padding: 20,
  },
});
