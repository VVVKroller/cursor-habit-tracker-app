import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export function AuthScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={[
        colors.gradient.start,
        colors.gradient.middle,
        colors.gradient.end,
      ]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons
                name="infinite-outline"
                size={64}
                color={colors.primary[500]}
              />
            </View>
            <Text style={styles.appName}>HabitFlow</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Track your habits, achieve your goals, and become your best self
            </Text>
          </View>

          <View style={styles.authButtons}>
            <Pressable
              style={styles.googleButton}
              onPress={() => {
                /* Google login */
              }}
            >
              <View style={styles.googleIconContainer}>
                <Ionicons name="logo-google" size={24} color="#DB4437" />
              </View>
              <Text style={styles.buttonText}>Continue with Google</Text>
            </Pressable>

            <Pressable
              style={styles.emailButton}
              onPress={() => navigation.navigate("Login")}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name="mail-outline"
                  size={24}
                  color={colors.text.primary}
                />
              </View>
              <Text style={styles.buttonText}>Continue with Email</Text>
            </Pressable>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            <Pressable
              style={styles.registerButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.registerButtonText}>Create an Account</Text>
            </Pressable>

            <Pressable
              style={styles.skipButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.skipButtonText}>
                Continue without Account
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 60,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface.medium,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  appName: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.primary[500],
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    maxWidth: width * 0.8,
    lineHeight: 24,
  },
  authButtons: {
    gap: 16,
    marginBottom: 40,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.medium,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  emailButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[500],
    padding: 16,
    borderRadius: 16,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.medium,
  },
  dividerText: {
    color: colors.text.secondary,
    marginHorizontal: 16,
    fontSize: 14,
  },
  registerButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.strong,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  registerButtonText: {
    color: colors.primary[500],
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  skipButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
});
