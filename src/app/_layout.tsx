import "@/global.css";
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Application from "expo-application";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Platform } from "react-native";
import "react-native-reanimated";
import { useVersions } from "../api/use-versions";
import { VersionAlert } from "../components/version-alert";
import { COLORS } from "../constants/colors";
import { queryClient } from "../lib/react-query";

const StripeProviderWrapper =
  Platform.OS === "web"
    ? ({ children }: { children: React.ReactNode }) => <>{children}</>
    : function StripeProviderNative({
      children,
    }: {
      children: React.ReactNode;
    }) {
      const { StripeProvider } = require("@stripe/stripe-react-native");
      return (
        <StripeProvider
          publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
          merchantIdentifier="merchant.com.anonymous.tatame"
          urlScheme="tatameapp"
        >
          {children}
        </StripeProvider>
      );
    };

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
          <StripeProviderWrapper>
            <RootLayout />
          </StripeProviderWrapper>
        </QueryClientProvider>
      </GluestackUIProvider>
    </ClerkProvider>
  );
}

function RootLayout() {
  const { isSignedIn } = useAuth();
  const { getLastVersion } = useVersions();
  const { data: lastVersion } = getLastVersion;

  if (
    lastVersion &&
    lastVersion?.appVersion !== Application.nativeApplicationVersion
  ) {
    return <VersionAlert lastVersion={lastVersion?.appVersion} />;
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
