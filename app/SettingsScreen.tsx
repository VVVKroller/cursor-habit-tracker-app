import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  color = "#3B82F6",
}: SettingsItemProps) => (
  <Pressable
    style={styles.settingsItem}
    onPress={onPress}
    android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
  >
    <View style={styles.settingsItemContent}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={20} color="#FFFFFF" />
      </View>
      <Text style={styles.settingsItemLabel}>{label}</Text>
    </View>
    {typeof value === "boolean" ? (
      <Switch value={value} onValueChange={onValueChange} />
    ) : showArrow ? (
      <Ionicons name="chevron-forward" size={20} color="#64748B" />
    ) : null}
  </Pressable>
);

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [healthSync, setHealthSync] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      <SettingsSection title="General">
        <SettingsItem
          icon="notifications"
          label="Notifications"
          value={notifications}
          onValueChange={setNotifications}
          color="#3B82F6"
        />
        <SettingsItem
          icon="moon"
          label="Dark Mode"
          value={darkMode}
          onValueChange={setDarkMode}
          color="#6366F1"
        />
        <SettingsItem
          icon="heart"
          label="Health App Sync"
          value={healthSync}
          onValueChange={setHealthSync}
          color="#EC4899"
        />
      </SettingsSection>

      <SettingsSection title="Account">
        <SettingsItem
          icon="person"
          label="Profile"
          onPress={() => console.log("Profile")}
          color="#8B5CF6"
        />
        <SettingsItem
          icon="lock-closed"
          label="Privacy"
          onPress={() => console.log("Privacy")}
          color="#10B981"
        />
        <SettingsItem
          icon="shield-checkmark"
          label="Security"
          onPress={() => console.log("Security")}
          color="#F59E0B"
        />
      </SettingsSection>

      <SettingsSection title="Data">
        <SettingsItem
          icon="cloud-upload"
          label="Backup Data"
          onPress={() => console.log("Backup")}
          color="#14B8A6"
        />
        <SettingsItem
          icon="cloud-download"
          label="Restore Data"
          onPress={() => console.log("Restore")}
          color="#6366F1"
        />
        <SettingsItem
          icon="trash"
          label="Clear All Data"
          onPress={() => console.log("Clear")}
          color="#EF4444"
        />
      </SettingsSection>

      <SettingsSection title="About">
        <SettingsItem
          icon="information-circle"
          label="App Version"
          showArrow={false}
          onPress={() => {}}
          color="#64748B"
        />
        <SettingsItem
          icon="document-text"
          label="Terms of Service"
          onPress={() => console.log("Terms")}
          color="#64748B"
        />
        <SettingsItem
          icon="help-circle"
          label="Help & Support"
          onPress={() => console.log("Help")}
          color="#64748B"
        />
      </SettingsSection>

      <Pressable
        style={styles.logoutButton}
        onPress={() => console.log("Logout")}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginLeft: 16,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
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
    color: "#1E293B",
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 24,
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
