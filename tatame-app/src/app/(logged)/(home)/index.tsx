import { HomeGym } from "@/src/components/home-gym";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="pt-10 pl-5 pr-5 pb-10">
      <HomeGym />
    </SafeAreaView>
  );
}
