import React, { useEffect, useState } from "react";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthScreen } from "./screens/AuthScreen";

import LoginScreen from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import HabitsList from "./HabitsList";
import AddHabit from "./AddHabit";
import SettingsScreen from "./SettingsScreen";
import FriendsScreen from "./screens/FriendsScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import { Habit } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [steps, setSteps] = useState(0);
  const updateHabits = (habits: Habit[]) => {
//TODO Update in DB
    setHabits(habits);
    AsyncStorage.setItem("habits", JSON.stringify(habits));
  };

  useEffect(() => {
    // setTimeout(() => {
    //   Notifications.scheduleNotificationAsync({
    //     content: {
    //       title: "Look at that notification",
    //       body: "I'm so proud of myself!",
    //     },
    //     trigger: null,
    //   });
    // });

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
          initialRouteName="Auth"
          screenOptions={{
            animation: "none",
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={() => (
              <HabitsList habits={habits} setHabits={updateHabits} />
            )}
            options={{
              headerShown: false,
              animation: "none",
            }}
          />
          <Stack.Screen
            name="AddHabit"
            component={() => (
              <AddHabit
                addHabit={(habit: Habit) => {
                  const newHabits = [...habits, habit];
                  updateHabits(newHabits);
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
          <Stack.Screen
            name="analytics"
            component={() => (
              <AnalyticsScreen
                habits={habits}
                waterIntake={waterIntake}
                steps={steps}
              />
            )}
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