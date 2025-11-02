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
      <Stack.Screen name="user-type-selection" />
      <Stack.Screen name="index" />
    </Stack>
  );
}
