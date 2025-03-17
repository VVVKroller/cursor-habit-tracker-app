import React from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutUp,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { colors } from "../../utils/colors";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface HabitEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  habitName: string;
  onChangeHabitName: (text: string) => void;
}

// Animation configurations
const FADE_IN_CONFIG = {
  duration: 200,
  easing: Easing.bezier(0.2, 0, 0, 1),
};

const SLIDE_CONFIG = {
  duration: 300,
  easing: Easing.bezier(0.2, 0, 0, 1),
};

export function HabitEditModal({
  visible,
  onClose,
  onSave,
  habitName,
  onChangeHabitName,
}: HabitEditModalProps) {
  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave();
  };

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={handleClose}
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
          exiting={SlideOutUp.duration(200).easing(Easing.bezier(0.4, 0, 1, 1))}
          style={styles.modalContent}
        >
          <LinearGradient
            colors={[colors.surface.light, colors.surface.medium]}
            style={styles.gradient}
          >
            <View style={styles.handle} />

            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Edit Habit</Text>
                <Text style={styles.subtitle}>Change your habit details</Text>
              </View>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Ionicons
                  name="close-outline"
                  size={28}
                  color={colors.text.secondary}
                />
              </Pressable>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={habitName}
                onChangeText={onChangeHabitName}
                placeholder="Enter habit name"
                placeholderTextColor={colors.text.tertiary}
                autoFocus
                selectionColor={colors.primary[500]}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
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
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
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
