import { HomeGym } from "@/src/components/home-gym";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="pl-5 pr-5">
      <HomeGym />
    </SafeAreaView>
  );
}
