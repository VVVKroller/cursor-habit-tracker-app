import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./utils/colors";
import { BottomNavigation } from "./components/Navigation/BottomNavigation";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { user, signInWithGoogle } from "./utils/firebase";

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection = ({ title, children }: SettingsSectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

type SettingsItemProps = {
  icon: string;
  label: string;
  value?: boolean;
  onPress?: () => void;
  onValueChange?: (value: boolean) => void;
  showArrow?: boolean;
  color?: string;
};

const SettingsItem = ({
  icon,
  label,
  value,
  onPress,
  onValueChange,
  showArrow = true,
  color = colors.primary[500],
}: SettingsItemProps) => (
  <Pressable
    style={styles.settingsItem}
    onPress={onPress}
    android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
  >
    <View style={styles.settingsItemContent}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={20} color={colors.text.primary} />
      </View>
      <Text style={styles.settingsItemLabel}>{label}</Text>
    </View>
    {typeof value === "boolean" ? (
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.surface.light, true: colors.primary[500] }}
        thumbColor={colors.text.primary}
      />
    ) : showArrow ? (
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.text.secondary}
      />
    ) : null}
  </Pressable>
);

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [healthSync, setHealthSync] = React.useState(true);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in:", error);
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
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Settings</Text>

          {user ? (
            <View style={styles.profileSection}>
              <View style={styles.profileContent}>
                <View style={styles.avatarContainer}>
                  {user.photoURL ? (
                    <Image
                      source={{ uri: user.photoURL }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Ionicons
                        name="person"
                        size={24}
                        color={colors.text.primary}
                      />
                    </View>
                  )}
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {user.displayName || "User"}
                  </Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                  <Ionicons
                    name="log-out-outline"
                    size={24}
                    color={colors.status.error}
                  />
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.authSection}>
              <Pressable style={styles.signInButton} onPress={handleSignIn}>
                <View style={styles.googleIconContainer}>
                  <Ionicons name="logo-google" size={20} color="#8AB4F8" />
                </View>
                <Text style={styles.signInText}>Sign in with Google</Text>
              </Pressable>
            </View>
          )}

          <SettingsSection title="General">
            <SettingsItem
              icon="notifications"
              label="Notifications"
              value={notifications}
              onValueChange={setNotifications}
              color={colors.primary[500]}
            />
            <SettingsItem
              icon="moon"
              label="Dark Mode"
              value={darkMode}
              onValueChange={setDarkMode}
              color={colors.primary[600]}
            />
            <SettingsItem
              icon="heart"
              label="Health App Sync"
              value={healthSync}
              onValueChange={setHealthSync}
              color={colors.status.error}
            />
          </SettingsSection>

          <SettingsSection title="Account">
            <SettingsItem
              icon="person"
              label="Profile"
              onPress={() => console.log("Profile")}
              color={colors.primary[400]}
            />
            <SettingsItem
              icon="lock-closed"
              label="Privacy"
              onPress={() => console.log("Privacy")}
              color={colors.status.success}
            />
            <SettingsItem
              icon="shield-checkmark"
              label="Security"
              onPress={() => console.log("Security")}
              color={colors.status.warning}
            />
          </SettingsSection>

          <SettingsSection title="Data">
            <SettingsItem
              icon="cloud-upload"
              label="Backup Data"
              onPress={() => console.log("Backup")}
              color={colors.primary[300]}
            />
            <SettingsItem
              icon="cloud-download"
              label="Restore Data"
              onPress={() => console.log("Restore")}
              color={colors.primary[400]}
            />
            <SettingsItem
              icon="trash"
              label="Clear All Data"
              onPress={() => console.log("Clear")}
              color={colors.status.error}
            />
          </SettingsSection>

          <SettingsSection title="About">
            <SettingsItem
              icon="information-circle"
              label="App Version"
              showArrow={false}
              onPress={() => {}}
              color={colors.text.secondary}
            />
            <SettingsItem
              icon="document-text"
              label="Terms of Service"
              onPress={() => console.log("Terms")}
              color={colors.text.secondary}
            />
            <SettingsItem
              icon="help-circle"
              label="Help & Support"
              onPress={() => console.log("Help")}
              color={colors.text.secondary}
            />
          </SettingsSection>
        </ScrollView>
      </SafeAreaView>
      <BottomNavigation />
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
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text.primary,
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
    marginLeft: 16,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: colors.surface.medium,
    borderRadius: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  settingsItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingsItemLabel: {
    fontSize: 16,
    color: colors.text.primary,
  },
  logoutButton: {
    padding: 8,
  },
  profileSection: {
    backgroundColor: colors.surface.medium,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  authSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  googleIconContainer: {
    marginRight: 12,
  },
  signInText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#E8EAED",
    fontFamily: "System",
  },
});
