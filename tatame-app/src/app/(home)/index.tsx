import { SignOutButton } from "@/src/components/sign-out-button";
import { Text } from "@/src/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView>
      <Text className="text-neutral-900">Home</Text>
      <SignOutButton />
    </SafeAreaView>
  );
}
