import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./utils/colors";
import { BottomNavigation } from "./components/Navigation/BottomNavigation";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { user, signInWithGoogle, signOut } from "./utils/firebase";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutUp,
  withTiming,
  Easing,
} from "react-native-reanimated";

type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Settings: undefined;
  AddHabit: undefined;
  Friends: undefined;
  Analytics: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

const LogoutConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!visible) return null;

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
        style={styles.deleteModalOverlay}
      >
        <Animated.View
          entering={SlideInDown.duration(300)}
          exiting={SlideOutUp.duration(200)}
          style={styles.deleteModalContent}
        >
          <LinearGradient
            colors={[colors.surface.light, colors.surface.medium]}
            style={styles.deleteModalGradient}
          >
            <View style={styles.deleteModalHeader}>
              <View style={styles.deleteIconContainer}>
                <Ionicons name="log-out-outline" size={32} color={colors.status.error} />
              </View>
              <Text style={styles.deleteModalTitle}>Sign Out</Text>
              <Pressable style={styles.deleteModalCloseButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.text.secondary} />
              </Pressable>
            </View>

            <Text style={styles.deleteModalDescription}>
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </Text>

            <View style={styles.deleteModalButtons}>
              <Pressable style={styles.deleteModalCancelButton} onPress={onClose}>
                <Text style={styles.deleteModalCancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.deleteModalConfirmButton}
                onPress={onConfirm}
              >
                <Text style={styles.deleteModalConfirmButtonText}>Sign Out</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [healthSync, setHealthSync] = React.useState(true);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut();

      // Clear all app data from AsyncStorage
      await AsyncStorage.multiRemove([
        "user",
        "habits",
        "waterIntake",
        "settings",
        "lastSyncDate",
      ]);

      // Reset navigation to Auth screen
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
                <Pressable 
                  style={styles.logoutButton} 
                  onPress={() => setShowLogoutModal(true)}
                >
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
      <LogoutConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
      />
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
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  deleteModalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  deleteModalGradient: {
    padding: 24,
  },
  deleteModalHeader: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
    paddingTop: 16,
  },
  deleteIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.status.error}20`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  deleteModalCloseButton: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.medium,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  deleteModalDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  deleteModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  deleteModalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface.medium,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  deleteModalCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  deleteModalConfirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.status.error,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteModalConfirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
});
