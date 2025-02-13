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
import { Habit } from "./types";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const AVATARS = ["🏃‍♂️", "💪", "🧘‍♀️", "📚", "💧", "🥗", "😴", "🎯"];

type RootStackParamList = {
  Home: undefined;
  // ... other screens
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AddHabit({
  addHabit,
}: {
  addHabit: (habit: Habit) => void;
}) {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
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

  const handleCreate = () => {
    addHabit({
      id: 0,
      name: name,
      daysCompleted: 0,
      description: description,
      type: type,
      frequency: "daily",
      isCompleted: false,
      goal: parseInt(goal),
    });
    navigation.navigate("Home");
  };

  return (
    <ScrollView style={styles.container}>
      <Box style={styles.card}>
        <Text style={styles.title}>Create a New Habit</Text>

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

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textarea}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your habit"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
            />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 24,
  },
  content: {
    gap: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1E293B",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1E293B",
    height: 100,
    textAlignVertical: "top",
  },
  weekDays: {
    flexWrap: "wrap",
    gap: 8,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    minWidth: 45,
    alignItems: "center",
  },
  dayButtonSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  dayText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "500",
  },
  dayTextSelected: {
    color: "#FFFFFF",
  },
  avatarButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 8,
    width: 120,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  avatarOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
  },
  buttonText: {
    marginLeft: 8,
    color: "#475569",
    fontSize: 14,
  },
  createButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
