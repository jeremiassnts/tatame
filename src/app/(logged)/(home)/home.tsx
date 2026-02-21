import { useIsLowerRole } from "@/src/api/roles/is-lower-role";
import { BirthdayAlert } from "@/src/components/birthday-alert";
import { GraduationCard } from "@/src/components/graduation-card";
import { HomeGymHeader } from "@/src/components/home-gym/header";
import { NextClass } from "@/src/components/next-class";
import { VStack } from "@/src/components/ui/vstack";
import { WeekPresence } from "@/src/components/week-presence";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { gym, isLoading } = useProfileContext();
  const isLowerRole = useIsLowerRole();

  return (
    <SafeAreaView className="pl-5 pr-5">
      <VStack className="items-start gap-4">
        <BirthdayAlert />
        <HomeGymHeader gym={gym} />
        {isLowerRole() && <WeekPresence />}
        <GraduationCard showBelt={false} />
        <NextClass gym={gym} isLoadingGym={isLoading} />
      </VStack>
    </SafeAreaView>
  );
}
