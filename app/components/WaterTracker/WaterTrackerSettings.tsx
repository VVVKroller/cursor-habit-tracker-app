import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { colors } from "../../utils/colors";

interface WaterTrackerSettingsProps {
  visible: boolean;
  onClose: () => void;
  onSave: (dailyGoal: number, glassCapacity: number) => void;
  currentDailyGoal: number;
  currentGlassCapacity: number;
}

export function WaterTrackerSettings({
  visible,
  onClose,
  onSave,
  currentDailyGoal,
  currentGlassCapacity,
}: WaterTrackerSettingsProps) {
  const [dailyGoal, setDailyGoal] = useState(currentDailyGoal.toString());
  const [glassCapacity, setGlassCapacity] = useState(
    currentGlassCapacity.toString()
  );

  const handleSave = () => {
    onSave(Number(dailyGoal), Number(glassCapacity));
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <Animated.View
          entering={SlideInDown.springify().damping(15)}
          exiting={SlideOutDown}
          style={styles.modalContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Water Intake Settings</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons
                name="close-outline"
                size={28}
                color={colors.text.secondary}
              />
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Daily Goal (L)</Text>
            <TextInput
              style={styles.input}
              value={dailyGoal}
              onChangeText={setDailyGoal}
              keyboardType="decimal-pad"
              placeholder="Enter daily goal in liters"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Glass Capacity (ml)</Text>
            <TextInput
              style={styles.input}
              value={glassCapacity}
              onChangeText={setGlassCapacity}
              keyboardType="number-pad"
              placeholder="Enter glass capacity in ml"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: colors.surface.light,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
    backdropFilter: "blur(10px)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.light,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 2,
    borderColor: colors.border.medium,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    height: 50,
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
    backgroundColor: colors.surface.light,
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
