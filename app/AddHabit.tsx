import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Habit, WeekDay } from "./types";
import { colors } from "./utils/colors";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createHabit } from "./utils/firebase";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const AVATARS = ["🏃‍♂️", "💪", "🧘‍♀️", "📚", "💧", "🥗", "😴", "🎯"];

type RootStackParamList = {
  Home: undefined;
  AddHabit: {
    type: "good" | "bad";
  };
  // ... other screens
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AddHabit({
  addHabit,
}: {
  addHabit: (habit: Habit) => void;
}) {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, "AddHabit">>();
  const type = route.params?.type || "good";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [showAvatars, setShowAvatars] = useState(false);

  const toggleDay = (index: number) => {
    setSelectedDays((prev) =>
      prev.includes(index)
        ? prev.filter((day) => day !== index)
        : [...prev, index]
    );
  };

  const handleCreate = async () => {
    if (selectedDays.length === 0) {
      alert('You haven\'t selected days!')
      // Можно добавить Alert с предупреждением
      return;
    }

    const habit: Habit = {
      id: crypto.randomUUID(),
      name: name,
      daysCompleted: 0,
      description: description,
      type: type,
      frequency: selectedDays as WeekDay[],
      isCompleted: false,
      goal: goal ? parseInt(goal) : -1,
    };
    addHabit(habit);
    await createHabit(habit);
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Box style={styles.card}>
          <HStack style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.text.primary}
              />
            </Pressable>
            <View style={styles.headerContent}>
              <View
                style={[
                  styles.habitTypeIndicator,
                  { backgroundColor: type === "good" ? "#22C55E" : "#EF4444" },
                ]}
              >
                <Text style={styles.habitTypeEmoji}>
                  {type === "good" ? "👍" : "👎"}
                </Text>
              </View>
              <VStack style={styles.titleContainer}>
                <Text style={styles.title}>Create a New Habit</Text>
                <Text
                  style={[
                    styles.habitType,
                    { color: type === "good" ? "#22C55E" : "#EF4444" },
                  ]}
                >
                  {type === "good" ? "Good Habit" : "Bad Habit"}
                </Text>
              </VStack>
            </View>
          </HStack>

          <VStack style={styles.content}>
            {/* Avatar Selection */}
            <View style={styles.section}>
              <Text style={styles.label}>Avatar</Text>
              <Pressable
                style={styles.avatarButton}
                onPress={() => setShowAvatars(!showAvatars)}
              >
                <Text style={styles.avatarText}>{selectedAvatar}</Text>
                <Text style={styles.buttonText}>Change</Text>
              </Pressable>
              {showAvatars && (
                <View style={styles.avatarGrid}>
                  {AVATARS.map((avatar, index) => (
                    <Pressable
                      key={index}
                      style={styles.avatarOption}
                      onPress={() => {
                        setSelectedAvatar(avatar);
                        setShowAvatars(false);
                      }}
                    >
                      <Text style={styles.avatarText}>{avatar}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Habit Name */}
            <View style={styles.section}>
              <Text style={styles.label}>Habit Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter habit name"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Frequency Selection */}
            <View style={styles.section}>
              <Text style={styles.label}>Frequency (Select weekdays)</Text>
              <HStack style={styles.weekDays}>
                {WEEKDAYS.map((day, index) => (
                  <Pressable
                    key={day}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(index) && styles.dayButtonSelected,
                    ]}
                    onPress={() => toggleDay(index)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        selectedDays.includes(index) && styles.dayTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </Pressable>
                ))}
              </HStack>
            </View>

            {/* Goal */}
            <View style={styles.section}>
              <Text style={styles.label}>Goal (days)</Text>
              <TextInput
                style={styles.input}
                value={goal}
                onChangeText={setGoal}
                placeholder="7"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
          </VStack>

          <Pressable style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.createButtonText}>Create Habit</Text>
          </Pressable>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.gradient.middle,
  },
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "transparent",
    margin: 20,
    marginTop: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.light,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  habitTypeIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  habitTypeEmoji: {
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  habitType: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    gap: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.tertiary,
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: colors.surface.medium,
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border.medium,
    backgroundColor: colors.surface.light,
    alignItems: "center",
    justifyContent: "center",
  },
  dayButtonSelected: {
    backgroundColor: colors.primary[500],
    borderColor: "transparent",
  },
  dayText: {
    color: colors.text.secondary,
    fontSize: 15,
    fontWeight: "600",
  },
  dayTextSelected: {
    color: colors.text.primary,
  },
  avatarButton: {
    backgroundColor: colors.surface.medium,
    borderColor: colors.border.medium,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    width: 120,
  },
  avatarText: {
    fontSize: 32,
  },
  buttonText: {
    color: colors.text.secondary,
    fontSize: 15,
    fontWeight: "500",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  avatarOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface.medium,
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  createButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  createButtonText: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
