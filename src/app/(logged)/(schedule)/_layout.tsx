import { COLORS } from "@/src/constants/colors";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="create-class" />
      <Stack.Screen name="edit-class" />
      <Stack.Screen name="[classId]/index" />
    </Stack>
  );
}
