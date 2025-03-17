import React, { useEffect } from "react";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function RootLayoutNav() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        // Auth screens
        <>
          <Stack.Screen
            name="Login"
            options={{
              title: "Вход",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="Register"
            options={{
              title: "Регистрация",
              headerShown: true,
            }}
          />
        </>
      ) : (
        // App screens
        <>
          <Stack.Screen
            name="Home"
            options={{
              title: "Главная",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="AddHabit"
            options={{
              title: "Добавить привычку",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: "Настройки",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="analytics"
            options={{
              title: "Аналитика",
              headerShown: true,
            }}
          />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}

//TODO Продумать приложение и разрисовать основные скрины. Красиво делать не надо, но функционально
//TODO Закодить
//TODO
