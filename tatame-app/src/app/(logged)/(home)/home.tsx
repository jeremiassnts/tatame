import { HomeGym } from "@/src/components/home-gym";
import { SignOutButton } from "@/src/components/sign-out-button";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="p-5">
      <HomeGym />
      <SignOutButton/>
    </SafeAreaView>
  );
}
