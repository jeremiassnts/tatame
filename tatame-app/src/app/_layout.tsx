import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import "react-native-reanimated";
import { StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Stack screenOptions={{
        contentStyle: styles.container,
        headerShown: false,
      }}>
        <Stack.Screen name="login" />
      </Stack>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
