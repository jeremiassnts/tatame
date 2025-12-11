import { Stack } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import "react-native-reanimated";
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import "@/global.css";
import { COLORS } from "../constants/colors";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootApp() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <GluestackUIProvider mode="dark">
        <QueryClientProvider client={queryClient}>
          <RootLayout />
        </QueryClientProvider>
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
        <Stack.Screen name="(logged)" />
        {/* redirect route for sso callback */}
        <Stack.Screen name="sso-callback" />
      </Stack.Protected>
    </Stack>
  );
}
