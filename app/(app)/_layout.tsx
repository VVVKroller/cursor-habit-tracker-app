import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" />
      <Stack.Screen name="AddHabit" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="analytics" />
    </Stack>
  );
}
