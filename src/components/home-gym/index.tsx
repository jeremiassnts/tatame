import { useIsLowerRole } from "@/src/api/roles/is-lower-role";
import { GraduationCard } from "../graduation-card";
import { NextClass } from "../next-class";
import { VStack } from "../ui/vstack";
import { WeekPresence } from "../week-presence";
import { HomeGymHeader } from "./header";

export function HomeGym() {
  return (
    <VStack className="items-start gap-4">
      <HomeGymHeader />
      {useIsLowerRole() && <WeekPresence />}
      <GraduationCard showBelt={false} />
      <NextClass />
    </VStack>
  );
}
