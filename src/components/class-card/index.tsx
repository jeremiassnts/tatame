import { useRoles } from "@/src/api/use-roles";
import { ClassRow } from "@/src/types/extendend-database.types";
import { formatDay, formatTime } from "@/src/utils/class";
import { isAfter, startOfWeek } from "date-fns";
import { Text as TextIcon } from 'lucide-react-native';
import { Badge, BadgeIcon, BadgeText } from "../ui/badge";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { ArrowRightIcon, PlayIcon, UserIcon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { Actions } from "./actions";
import { CheckIn } from "./check-in";
import { CheckIns } from "./check-ins";

interface ClassCardProps {
  data: ClassRow;
  topBadgeText?: string;
  currentClass: boolean;
  classDate?: string;
}

export function ClassCard({
  data,
  topBadgeText,
  currentClass,
  classDate,
}: ClassCardProps) {
  const { getRole } = useRoles();
  const { data: role } = getRole;
  const startOfWeekDate = classDate ? startOfWeek(new Date(classDate)) : undefined;
  const videos = startOfWeekDate ? data.assets?.filter(a => a.type === 'video' && isAfter(new Date(a.valid_until ?? ''), startOfWeekDate))?.length : 0;
  const instructions = startOfWeekDate ? data.assets?.filter(a => a.type === 'text' && isAfter(new Date(a.valid_until ?? ''), startOfWeekDate))?.length : 0;

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
            {formatDay(data.day)} / {formatTime(data.start)} - {formatTime(data.end)}
          </Text>
        </VStack>
        <Actions topBadgeText={topBadgeText} role={role} data={data} classDate={classDate} />
        <CheckIn role={role} class={data} />
      </HStack>
      <CheckIns classId={data.id} />
      {classDate && <HStack className="gap-2 items-center justify-start">
        <Badge className="gap-1">
          <BadgeIcon as={PlayIcon} />
          <BadgeText>{videos}</BadgeText>
        </Badge>
        <Badge className="gap-1">
          <BadgeIcon as={TextIcon} />
          <BadgeText>{instructions}</BadgeText>
        </Badge>
      </HStack>}
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
