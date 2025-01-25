import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack } from "@/components/ui/hstack";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomNavigation } from "../components/Navigation/BottomNavigation";

type Friend = {
  id: string;
  name: string;
  sharedHabits: {
    name: string;
    progress: number;
    goal: number;
    unit: string;
  }[];
  avatar?: string;
};

const mockFriends: Friend[] = [
  {
    id: "1",
    name: "Alex Smith",
    sharedHabits: [
      { name: "Daily Steps", progress: 8500, goal: 10000, unit: "steps" },
      { name: "Read Books", progress: 2, goal: 3, unit: "hours" },
    ],
  },
  {
    id: "2",
    name: "Maria Garcia",
    sharedHabits: [
      { name: "Daily Steps", progress: 10000, goal: 10000, unit: "steps" },
      { name: "Meditation", progress: 15, goal: 20, unit: "minutes" },
    ],
  },
];

export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const renderFriend = ({ item }: { item: Friend }) => (
    <Pressable style={styles.friendItem}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person" size={24} color={colors.text.secondary} />
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <View style={styles.habitsContainer}>
          {item.sharedHabits.map((habit, index) => (
            <View key={index} style={styles.habitProgress}>
              <Text style={styles.habitName}>{habit.name}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(habit.progress / habit.goal) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {habit.progress}/{habit.goal} {habit.unit}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={[
        colors.gradient.start,
        colors.gradient.middle,
        colors.gradient.end,
      ]}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Friends</Text>
          <Pressable style={styles.addButton}>
            <Ionicons name="person-add" size={24} color={colors.text.primary} />
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={mockFriends}
          renderItem={renderFriend}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>

      <BottomNavigation />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text.primary,
  },
  addButton: {
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface.medium,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: colors.text.primary,
    fontSize: 16,
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface.medium,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface.light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  habitsContainer: {
    marginTop: 8,
    gap: 8,
  },
  habitProgress: {
    marginTop: 4,
  },
  habitName: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.surface.light,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary[500],
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  navigationContainer: {
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backdropFilter: "blur(10px)",
    zIndex: 2,
  },
  navButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
