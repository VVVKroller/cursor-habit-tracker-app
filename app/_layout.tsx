import React from "react";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import HabitsList from "./HabitsList";
import AddHabit from "./AddHabit";
import HomeScreen from "./HomeScreen";
import AddHabitScreen from "./AddHabitScreen";
import SettingsScreen from "./SettingsScreen";
import FriendsScreen from "./screens/FriendsScreen";

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="light">
        <Stack.Navigator initialRouteName="Home">
          {/* Экран входа */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Вход" }}
          />
          {/* Экран регистрации */}
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Регистрация" }}
          />
          {/* Главный экран с привычками */}
          <Stack.Screen
            name="Home"
            component={HabitsList}
            options={{
              headerShown: false,
            }}
          />
          {/* Экран добавления новой привычки */}
          <Stack.Screen
            name="AddHabit"
            component={AddHabit}
            options={{ title: "Добавить привычку" }}
          />
          <Stack.Screen
            name="settings"
            component={SettingsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="friends"
            component={FriendsScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}

//TODO Продумать приложение и разрисовать основные скрины. Красиво делать не надо, но функционально
//TODO Закодить
//TODO
