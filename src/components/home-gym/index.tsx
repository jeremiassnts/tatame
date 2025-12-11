import { Badge, BadgeText } from "../ui/badge";
import { VStack } from "../ui/vstack";
import { useGyms } from "@/src/api/use-gyms";
import { HomeGymHeader } from "./header";
import { GraduationCard } from "../graduation-card";
import { NextClass } from "../next-class";

export function HomeGym() {
  const { fetchByUser } = useGyms();
  const { data: gym, isLoading: isLoadingGym } = fetchByUser;

  return (
    <VStack className="items-start gap-6">
      <Badge size="lg" variant="solid" action="muted" className="rounded-sm">
        <BadgeText>Home</BadgeText>
      </Badge>
      <HomeGymHeader gym={gym} />
      <GraduationCard showBelt={false} />
      <NextClass gym={gym} isLoadingGym={isLoadingGym} />
    </VStack>
  );
}
