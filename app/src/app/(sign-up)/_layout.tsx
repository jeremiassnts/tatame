import Icon from "@react-native-vector-icons/feather";
import { Stack, useRouter, usePathname } from "expo-router";
import { View } from "react-native";
import { Button } from "~/src/components/ui/button";
import SignUpProvider from "~/src/providers/sign-up-provider";

export default function SignUpLayout() {
  const router = useRouter();
  const pathname = usePathname();

  function handleGoBack() {
    router.back();
  }

  return (
    <View className="flex flex-1 bg-neutral-900 pt-10 pl-6 pr-6">
      {pathname !== "/conclusion" && (
        <Button
          onPress={handleGoBack}
          size={"icon"}
          className="rounded-full w-[36px] h-[36px] bg-neutral-800 flex items-center justify-center"
        >
          <Icon name="arrow-left" color={"#ffffff"} size={20} />
        </Button>
      )}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="gym-creation" />
        <Stack.Screen name="user-creation" />
        <Stack.Screen name="graduation-creation" />
        <Stack.Screen name="subscription" />
        <Stack.Screen name="conclusion" />
      </Stack>
    </View>
  );
}
