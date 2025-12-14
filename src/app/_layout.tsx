import "@/global.css";
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Application from "expo-application";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useVersions } from "../api/use-versions";
import { SplashScreen as SplashScreenComponent } from "../components/splash-screen";
import { VersionAlert } from "../components/version-alert";
import { COLORS } from "../constants/colors";
import { queryClient } from "../lib/react-query";

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
  const { getLastVersion } = useVersions();
  const { data: lastVersion, isLoading: isLoadingLastVersion } = getLastVersion

  if (isLoadingLastVersion) {
    return <SplashScreenComponent />
  }

  if (!__DEV__ && lastVersion?.appVersion !== Application.nativeBuildVersion) {
    return <VersionAlert />
  }

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
