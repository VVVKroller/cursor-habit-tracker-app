import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HStack } from "@/components/ui/hstack";
import { colors } from "@/app/utils/colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface BottomNavigationProps {
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
}

export function BottomNavigation({
  isMenuOpen,
  onToggleMenu,
}: BottomNavigationProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const isHomeScreen = route.name === "Home";

  return (
    <HStack style={styles.navigationContainer}>
      <Pressable
        style={styles.navButton}
        onPress={() => navigation.navigate("analytics")}
      >
        <Ionicons name="bar-chart" size={24} color="#FFF" />
      </Pressable>

      <Pressable
        style={[styles.navButton, styles.centerButton]}
        onPress={() => {
          if (isHomeScreen) {
            onToggleMenu?.();
          } else {
            navigation.navigate("Home");
          }
        }}
      >
        <Ionicons
          name={isHomeScreen ? (isMenuOpen ? "close" : "add") : "home"}
          size={28}
          color="#FFF"
        />
      </Pressable>

      <Pressable
        style={styles.navButton}
        onPress={() => navigation.navigate("settings")}
      >
        <Ionicons name="person" size={24} color="#FFF" />
      </Pressable>
    </HStack>
  );
}

const styles = StyleSheet.create({
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
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginTop: -20,
  },
});
