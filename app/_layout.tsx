import React, { useEffect, useState } from "react";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import HabitsList from "./HabitsList";
import AddHabit from "./AddHabit";
import SettingsScreen from "./SettingsScreen";
import FriendsScreen from "./screens/FriendsScreen";
import { Habit } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([]);
  useEffect(() => {
    const fetchHabits = async () => {
      const habits = await AsyncStorage.getItem("habits");
      if (habits) {
        setHabits(JSON.parse(habits));
      }
    };
    fetchHabits();
  }, []);
  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="light">
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            animation: "none",
            headerShown: false,
          }}
        >
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
            component={() => (
              <HabitsList habits={habits} setHabits={setHabits} />
            )}
            options={{
              headerShown: false,
              animation: "none",
            }}
          />
          {/* Экран добавления новой привычки */}
          <Stack.Screen
            name="AddHabit"
            component={() => (
              <AddHabit
                addHabit={(habit: Habit) => {
                  const newHabits = [...habits, habit];
                  AsyncStorage.setItem("habits", JSON.stringify(newHabits));
                  setHabits(newHabits);
                }}
              />
            )}
            options={{ title: "Добавить привычку" }}
          />
          <Stack.Screen
            name="settings"
            component={SettingsScreen}
            options={{
              headerShown: false,
              animation: "none",
            }}
          />
          <Stack.Screen
            name="friends"
            component={FriendsScreen}
            options={{
              headerShown: false,
              animation: "none",
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
