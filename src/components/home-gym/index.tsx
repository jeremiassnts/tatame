import { isLowerRole } from "@/src/api/roles/is-lower-role";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { GraduationCard } from "../graduation-card";
import { NextClass } from "../next-class";
import { VStack } from "../ui/vstack";
import { WeekPresence } from "../week-presence";
import { HomeGymHeader } from "./header";

export function HomeGym() {
  const { gym, isLoading } = useProfileContext();

  return (
    <VStack className="items-start gap-4">
      <HomeGymHeader gym={gym} />
      {isLowerRole() && <WeekPresence />}
      <GraduationCard showBelt={false} />
      <NextClass gym={gym} isLoadingGym={isLoading} />
    </VStack>
  );
}
