import React from "react";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import HabitsList from "./HabitsList";
import AddHabit from "./AddHabit";
import HomeScreen from "./HomeScreen";
import AddHabitScreen from "./AddHabitScreen";
import SettingsScreen from "./SettingsScreen";

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
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
          options={{ title: "Мои привычки" }}
        />
        {/* Экран добавления новой привычки */}
        <Stack.Screen
          name="AddHabit"
          component={AddHabit}
          options={{ title: "Добавить привычку" }}
        />
        <Stack.Screen name="settings" component={SettingsScreen} />
      </Stack.Navigator>
    </GluestackUIProvider>
  );
}

//TODO Продумать приложение и разрисовать основные скрины. Красиво делать не надо, но функционально
//TODO Закодить
//TODO
