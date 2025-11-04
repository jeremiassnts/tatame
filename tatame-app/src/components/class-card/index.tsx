import { ClassRow } from "@/src/types/extendend-database.types";
import { Badge, BadgeIcon, BadgeText } from "../ui/badge";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { ArrowRightIcon, UserIcon } from "../ui/icon";
import { Text } from "../ui/text";

interface ClassCardProps {
  data: ClassRow;
  topBadgeText: string;
}

export function ClassCard({ data, topBadgeText }: ClassCardProps) {
  function formatTime(time: string | null) {
    if (!time) return "";
    return time.split(":")[0] + ":" + time.split(":")[1];
  }

  return (
    <Card size="md" variant="elevated" className="m-3 bg-neutral-800">
      <Badge variant="outline" className="gap-1 self-start mb-3">
        {topBadgeText && <BadgeText>{topBadgeText}</BadgeText>}
        <BadgeIcon as={ArrowRightIcon} />
      </Badge>
      <Heading className="text-white font-bold" size="md">
        {data.description}
      </Heading>
      <Text>
        {formatTime(data.start)} - {formatTime(data.end)}
      </Text>
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
