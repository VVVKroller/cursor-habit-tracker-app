import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../utils/colors";
import Animated, { withSpring } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

interface StatusCirclesProps {
  steps: number;
  stepsGoal: number;
  waterIntake: number;
  waterGoal: number;
  onWaterPress: (event: any) => void;
}

export function StatusCircles({
  steps,
  stepsGoal,
  waterIntake,
  waterGoal,
  onWaterPress,
}: StatusCirclesProps) {
  const radius = 26;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;

  const stepsProgress = Math.min(steps / stepsGoal, 1);
  const waterProgress = Math.min(waterIntake / waterGoal, 1);

  const stepsStrokeDashoffset = circumference * (1 - stepsProgress);
  const waterStrokeDashoffset = circumference * (1 - waterProgress);

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Svg width={60} height={60}>
          <Circle
            cx={30}
            cy={30}
            r={radius}
            stroke={colors.surface.light}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={30}
            cy={30}
            r={radius}
            stroke={colors.status.success}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={stepsStrokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.iconContainer}>
          <Ionicons name="footsteps" size={20} color={colors.text.primary} />
          <Text style={styles.value}>{Math.round(steps / 100) / 10}k</Text>
        </View>
      </View>

      <Pressable style={styles.circle} onPress={(event) => onWaterPress(event)}>
        <Svg width={60} height={60}>
          <Circle
            cx={30}
            cy={30}
            r={radius}
            stroke={colors.surface.light}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={30}
            cy={30}
            r={radius}
            stroke={colors.primary[500]}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={waterStrokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.iconContainer}>
          <Ionicons name="water" size={20} color={colors.text.primary} />
          <Text style={styles.value}>{waterIntake}L</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },
  circle: {
    width: 60, 
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    alignItems: "center",
  },
  value: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
});
