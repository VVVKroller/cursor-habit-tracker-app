import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../services/api";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    loginUser({
      email,
      password,
      loginCallback: () => {
        navigation.navigate("Home");
      },
      errorCallback: (error) => {
        Alert.alert("Error", error.message || "Failed to login");
      },
    });
  };

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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
              {/* Header */}
              <Pressable
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.text.primary}
                />
              </Pressable>

              <View style={styles.header}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                  Sign in to continue your habit journey
                </Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={colors.text.secondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.text.secondary}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={colors.text.secondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor={colors.text.secondary}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={colors.text.secondary}
                      />
                    </Pressable>
                  </View>
                </View>

                <Pressable style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </Pressable>
              </View>

              {/* Login Button */}
              <View style={styles.footer}>
                <Pressable style={styles.loginButton} onPress={handleLogin}>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </Pressable>

                <Pressable
                  style={styles.registerLink}
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={styles.registerLinkText}>
                    Don't have an account?{" "}
                    <Text style={styles.registerLinkTextBold}>Sign Up</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.medium,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface.medium,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.medium,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 52,
    color: colors.text.primary,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignItems: "flex-end",
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: colors.primary[500],
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    marginTop: 32,
    gap: 16,
  },
  loginButton: {
    backgroundColor: colors.primary[500],
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  registerLink: {
    alignItems: "center",
    padding: 8,
  },
  registerLinkText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  registerLinkTextBold: {
    color: colors.primary[500],
    fontWeight: "600",
  },
});
