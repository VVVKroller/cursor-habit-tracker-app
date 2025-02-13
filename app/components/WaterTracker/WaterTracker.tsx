import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Ionicons } from "@expo/vector-icons";
import Animated, { withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { colors } from "../../utils/colors";
import { WaterTrackerSettings } from "./WaterTrackerSettings";

interface WaterTrackerProps {
  waterIntake: number;
  setWaterIntake: (value: number | ((prev: number) => number)) => void;
}

// Helper function for haptics
const triggerHaptic = () => {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

export function WaterTracker({
  waterIntake,
  setWaterIntake,
}: WaterTrackerProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(2); // 2L default
  const [glassCapacity, setGlassCapacity] = useState(250); // 250ml default

  const totalGlasses = Math.ceil((dailyGoal * 1000) / glassCapacity);
  const progress = (waterIntake * glassCapacity) / (dailyGoal * 1000);
  const currentML = waterIntake * glassCapacity;

  const handleSaveSettings = (
    newDailyGoal: number,
    newGlassCapacity: number
  ) => {
    setDailyGoal(newDailyGoal);
    setGlassCapacity(newGlassCapacity);
    // Adjust current intake if needed
    if (currentML > newDailyGoal * 1000) {
      setWaterIntake(Math.floor((newDailyGoal * 1000) / newGlassCapacity));
    }
  };

  const handleIncrement = () => {
    triggerHaptic();
    if (waterIntake < totalGlasses) {
      setWaterIntake((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    triggerHaptic();
    if (waterIntake > 0) {
      setWaterIntake((prev) => prev - 1);
    }
  };

  return (
    <Box style={styles.waterTrackerContainer}>
      <HStack style={styles.waterTrackerHeader}>
        <View>
          <Text style={styles.waterTrackerTitle}>Water Intake</Text>
          <Text style={styles.waterTrackerSubtitle}>
            Goal: {dailyGoal}L ({glassCapacity}ml glass)
          </Text>
        </View>
        <Pressable
          style={styles.settingsButton}
          onPress={() => setShowSettings(true)}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={colors.text.secondary}
          />
        </Pressable>
      </HStack>

      <View style={styles.waterProgressContainer}>
        <Animated.View
          style={[
            styles.waterProgress,
            {
              width: withSpring(`${progress * 100}%`, {
                damping: 15,
                stiffness: 100,
              }),
            },
          ]}
        />
      </View>

      <Text style={styles.waterAmount}>
        {currentML}ml / {dailyGoal * 1000}ml
      </Text>

      <HStack style={styles.waterGlassesContainer}>
        {[...Array(totalGlasses)].map((_, index) => (
          <Pressable
            key={index}
            onPress={() => setWaterIntake(index + 1)}
            style={({ pressed }) => [
              styles.waterGlass,
              pressed && styles.waterGlassPressed,
              index < waterIntake && styles.waterGlassFilled,
            ]}
          >
            <Ionicons
              name={index < waterIntake ? "water" : "water-outline"}
              size={28}
              color={index < waterIntake ? "#60A5FA" : colors.text.tertiary}
            />
          </Pressable>
        ))}
      </HStack>

      <HStack style={styles.waterControls}>
        <Pressable
          style={[
            styles.waterControlButton,
            waterIntake <= 0 && styles.waterControlButtonDisabled,
          ]}
          onPress={handleDecrement}
        >
          <Ionicons
            name="remove"
            size={24}
            color={
              waterIntake <= 0 ? colors.text.tertiary : colors.text.primary
            }
          />
        </Pressable>
        <Text style={styles.waterAmount}>{waterIntake} glasses</Text>
        <Pressable
          style={[
            styles.waterControlButton,
            waterIntake >= totalGlasses && styles.waterControlButtonDisabled,
          ]}
          onPress={handleIncrement}
        >
          <Ionicons
            name="add"
            size={24}
            color={
              waterIntake >= totalGlasses
                ? colors.text.tertiary
                : colors.text.primary
            }
          />
        </Pressable>
      </HStack>

      <WaterTrackerSettings
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
        currentDailyGoal={dailyGoal}
        currentGlassCapacity={glassCapacity}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  waterTrackerContainer: {
    backgroundColor: colors.surface.medium,
    padding: 24,
    borderRadius: 24,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  waterTrackerHeader: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  waterTrackerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  waterTrackerSubtitle: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.light,
    justifyContent: "center",
    alignItems: "center",
  },
  waterProgressContainer: {
    height: 8,
    backgroundColor: colors.surface.light,
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  waterProgress: {
    height: "100%",
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  waterAmount: {
    fontSize: 15,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  waterGlassesContainer: {
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
    justifyContent: "center",
  },
  waterGlass: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface.light,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  waterGlassPressed: {
    transform: [{ scale: 0.95 }],
  },
  waterGlassFilled: {
    backgroundColor: colors.primary[500] + "20",
    borderColor: colors.primary[500] + "40",
  },
  waterControls: {
    justifyContent: "center",
    gap: 12,
  },
  waterControlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  waterControlButtonDisabled: {
    backgroundColor: colors.surface.medium,
    shadowOpacity: 0,
    opacity: 0.5,
  },
});
