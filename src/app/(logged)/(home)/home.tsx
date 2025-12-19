import { useGyms } from "@/src/api/use-gyms";
import { useRoles } from "@/src/api/use-roles";
import { GraduationCard } from "@/src/components/graduation-card";
import { HomeGymHeader } from "@/src/components/home-gym/header";
import { NextClass } from "@/src/components/next-class";
import { VStack } from "@/src/components/ui/vstack";
import { WeekPresence } from "@/src/components/week-presence";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { fetchByUser } = useGyms();
  const { data: gym, isLoading: isLoadingGym } = fetchByUser;
  const { getRole } = useRoles();
  const { data: role } = getRole;

  return (
    <SafeAreaView className="pl-5 pr-5">
      <VStack className="items-start gap-4">
        <HomeGymHeader gym={gym} />
        {role == "STUDENT" && <WeekPresence />}
        <GraduationCard showBelt={false} />
        <NextClass gym={gym} isLoadingGym={isLoadingGym} />
      </VStack>
    </SafeAreaView>
  );
}
