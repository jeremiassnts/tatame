import { useRoles } from "@/src/api/use-roles";
import { ClassRow } from "@/src/types/extendend-database.types";
import { Badge, BadgeIcon, BadgeText } from "../ui/badge";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { ArrowRightIcon, UserIcon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { Actions } from "./actions";
import { CheckIn } from "./check-in";
import { CheckIns } from "./check-ins";

interface ClassCardProps {
  data: ClassRow;
  topBadgeText?: string;
  currentClass: boolean;
}

export function ClassCard({
  data,
  topBadgeText,
  currentClass,
}: ClassCardProps) {
  const { getRole } = useRoles();
  const { data: role } = getRole;

  function formatTime(time: string | null) {
    if (!time) return "";
    return time.split(":")[0] + ":" + time.split(":")[1];
  }

  return (
    <Card
      size="md"
      variant="elevated"
      className={`bg-neutral-800 w-full border-2 ${currentClass ? "border-violet-800" : "border-neutral-800"
        }`}
    >
      {topBadgeText && (
        <Badge variant="outline" className="gap-1 self-start mb-3">
          <BadgeText>{topBadgeText}</BadgeText>
          <BadgeIcon as={ArrowRightIcon} />
        </Badge>
      )}
      <HStack className="justify-between">
        <VStack className="items-start">
          <Heading className="text-white font-bold max-w-[200px]" size="md">
            {data.description}
          </Heading>
          <Text>
            {formatTime(data.start)} - {formatTime(data.end)}
          </Text>
        </VStack>
        <Actions topBadgeText={topBadgeText} role={role} data={data} />
        <CheckIn role={role} class={data} />
      </HStack>
      <CheckIns classId={data.id} />
      <HStack className="justify-between pt-4">
        <Badge className="gap-1">
          <BadgeIcon as={UserIcon} />
          <BadgeText>{data.instructor_name}</BadgeText>
        </Badge>
        <Badge variant="outline">
          <BadgeText>{data.modality}</BadgeText>
        </Badge>
      </HStack>
    </Card>
  );
}
