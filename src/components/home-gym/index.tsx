import { useGyms } from "@/src/api/use-gyms";
import { useRoles } from "@/src/api/use-roles";
import { GraduationCard } from "../graduation-card";
import { NextClass } from "../next-class";
import { Badge, BadgeText } from "../ui/badge";
import { VStack } from "../ui/vstack";
import { WeekPresence } from "../week-presence";
import { HomeGymHeader } from "./header";

export function HomeGym() {
  const { fetchByUser } = useGyms();
  const { data: gym, isLoading: isLoadingGym } = fetchByUser;
  const { getRole } = useRoles();
  const { data: role } = getRole;

  return (
    <VStack className="items-start gap-4">
      <Badge size="lg" variant="solid" action="muted" className="rounded-sm">
        <BadgeText>Home</BadgeText>
      </Badge>
      <HomeGymHeader gym={gym} />
      {role == "STUDENT" && <WeekPresence />}
      <GraduationCard showBelt={false} />
      <NextClass gym={gym} isLoadingGym={isLoadingGym} />
    </VStack>
  );
}
