import { Stack } from "expo-router";

export default function ScheduleLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="new-class" />
      <Stack.Screen name="edit-class" />
    </Stack>
  );
}
