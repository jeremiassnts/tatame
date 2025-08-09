import { useCallback, useEffect, useState } from "react";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { View } from "react-native";
import "~/global.css";
import * as Font from "expo-font";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query";
import SignUpProvider from "../providers/sign-up-provider";
import AuthenticationProvider, {
  useAuthentication,
} from "../providers/authentication-provider";
import UserTypeProvider, { useUserType } from "../providers/user-type-provider";
import { PortalHost } from "@rn-primitives/portal";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [preAppReady, setPreAppReady] = useState(false);
  //load configurations that don't depend on providers
  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          "Sora-Regular": require("~/assets/fonts/Sora-Regular.ttf"),
          "Sora-Bold": require("~/assets/fonts/Sora-Bold.ttf"),
          "Sora-ExtraBold": require("~/assets/fonts/Sora-ExtraBold.ttf"),
        });
      } catch (e) {
        console.warn("It was not possible to prepare app", e);
      } finally {
        setPreAppReady(true);
      }
    };

    prepare();
  }, []);

  if (!preAppReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <UserTypeProvider>
        <AuthenticationProvider>
          <RootApp />
          <PortalHost />
        </AuthenticationProvider>
      </UserTypeProvider>
    </QueryClientProvider>
  );
}

function RootApp() {
  const [appReady, setAppReady] = useState(false);
  const { isLoaded: isUserTypeLoaded, userType } = useUserType();
  const { isAuthenticated, isLoaded: isAuthenticatedLoaded } =
    useAuthentication();

  useEffect(() => {
    if (isUserTypeLoaded && isAuthenticatedLoaded) {
      setAppReady(true);
    }
  }, [isUserTypeLoaded, isAuthenticatedLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) return null;

  return (
    <SignUpProvider>
      <View onLayout={onLayoutRootView} className="flex-1">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected
            guard={isUserTypeLoaded && !userType && !isAuthenticated}
          >
            <Stack.Screen name="user-type-selection" />
          </Stack.Protected>
          <Stack.Protected
            guard={isUserTypeLoaded && !!userType && !isAuthenticated}
          >
            <Stack.Screen name="login" />
          </Stack.Protected>
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen
              name="(dashboard)"
              initialParams={{ screen: "home" }}
            />
          </Stack.Protected>
          <Stack.Screen name="(sign-up)" />
          <Stack.Screen name="forgot-password" />
        </Stack>
      </View>
    </SignUpProvider>
  );
}
