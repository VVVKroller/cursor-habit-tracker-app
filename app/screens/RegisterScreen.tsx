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
import { firebase } from "../../firebase";
import { createUserDocument } from "../services/firestore";

export function RegisterScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Create user document in Firestore
        const success = await createUserDocument(user.uid, {
          email,
          name,
        });

        if (success) {
          // Navigate to main app
          navigation.reset({
            index: 0,
            routes: [{ name: "Root" }],
          });
        } else {
          throw new Error("Failed to create user document");
        }
      }
    } catch (error: any) {
      Alert.alert(
        "Registration Error",
        error.message || "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
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
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                  Start your journey to better habits today
                </Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={colors.text.secondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your name"
                      placeholderTextColor={colors.text.secondary}
                      value={name}
                      onChangeText={setName}
                      editable={!isLoading}
                    />
                  </View>
                </View>

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
                      editable={!isLoading}
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
                      placeholder="Create a password"
                      placeholderTextColor={colors.text.secondary}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      editable={!isLoading}
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
              </View>

              {/* Register Button */}
              <View style={styles.footer}>
                <Pressable
                  style={[
                    styles.registerButton,
                    isLoading && styles.registerButtonDisabled,
                  ]}
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Text style={styles.registerButtonText}>
                      Creating Account...
                    </Text>
                  ) : (
                    <Text style={styles.registerButtonText}>
                      Create Account
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  style={styles.loginLink}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.loginLinkText}>
                    Already have an account?{" "}
                    <Text style={styles.loginLinkTextBold}>Log In</Text>
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
  footer: {
    marginTop: 32,
    gap: 16,
  },
  registerButton: {
    backgroundColor: colors.primary[500],
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    alignItems: "center",
    padding: 8,
  },
  loginLinkText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  loginLinkTextBold: {
    color: colors.primary[500],
    fontWeight: "600",
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
});
