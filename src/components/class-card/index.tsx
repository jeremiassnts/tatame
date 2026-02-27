import { ClassDetails } from "@/src/api/classes/get-class-by-id";
import { useIsHigherRole } from "@/src/api/roles/is-higher-role";
import { useIsLowerRole } from "@/src/api/roles/is-lower-role";
import { useIsMediumRole } from "@/src/api/roles/is-medium-role";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { formatDay, formatTime } from "@/src/utils/class";
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
  data: ClassDetails;
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
  const { user } = useProfileContext();
  const isHigherRole = useIsHigherRole();
  const isLowerRole = useIsLowerRole();
  const isMediumRole = useIsMediumRole();

  const canOpenActions =
    isHigherRole() || (isMediumRole() && data.instructorId === user?.id);

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
            {formatDay(data.day)} / {formatTime(data.start)} -{" "}
            {formatTime(data.end)}
          </Text>
        </VStack>
        <Actions
          topBadgeText={topBadgeText}
          isHigherRole={canOpenActions}
          data={data}
          classDate={classDate}
        />
        {isLowerRole() && <CheckIn class={data} classDate={classDate} />}
      </HStack>
      <CheckIns classId={data.id} date={classDate ?? ""} />
      {/* {classDate && <HStack className="gap-2 items-center justify-start">
        <Badge className="gap-1">
          <BadgeIcon as={PlayIcon} />
          <BadgeText>{videos}</BadgeText>
        </Badge>
        <Badge className="gap-1">
          <BadgeIcon as={TextIcon} />
          <BadgeText>{instructions}</BadgeText>
        </Badge>
      </HStack>} */}
      <HStack className="justify-between pt-4">
        <Badge className="gap-1">
          <BadgeIcon as={UserIcon} />
          <BadgeText>{data.instructorName}</BadgeText>
        </Badge>
        <Badge variant="outline">
          <BadgeText>{data.modality}</BadgeText>
        </Badge>
      </HStack>
    </Card>
  );
}
