import { Stack } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import "react-native-reanimated";
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import "@/global.css";
import { COLORS } from "../constants/colors";

export default function RootApp() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <GluestackUIProvider mode="dark">
        <RootLayout />
      </GluestackUIProvider>
    </ClerkProvider>
  );
}

function RootLayout() {
  const { isSignedIn } = useAuth();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      {/* public routes */}
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      {/* protected routes */}
      <Stack.Protected guard={isSignedIn!}>
        <Stack.Screen name="(home)" />
      </Stack.Protected>
    </Stack>
  );
}
