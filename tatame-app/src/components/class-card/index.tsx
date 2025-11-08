import { ClassRow } from "@/src/types/extendend-database.types";
import { Badge, BadgeIcon, BadgeText } from "../ui/badge";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  UserIcon,
} from "../ui/icon";
import { Text } from "../ui/text";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { useState } from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "../ui/actionsheet";
import { useRouter } from "expo-router";

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
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();

  function formatTime(time: string | null) {
    if (!time) return "";
    return time.split(":")[0] + ":" + time.split(":")[1];
  }

  function handleClose() {
    setShowOptions(false);
  }

  function handleEditClass() {
    router.push({
      pathname: "/(logged)/(schedule)/edit-class",
      params: {
        classId: data.id,
      },
    });
    handleClose();
  }

  return (
    <Card
      size="md"
      variant="elevated"
      className={`bg-neutral-800 w-full border-2 ${
        currentClass ? "border-violet-800" : "border-neutral-800"
      }`}
    >
      {topBadgeText && (
        <Badge variant="outline" className="gap-1 self-start mb-3">
          <BadgeText>{topBadgeText}</BadgeText>
          <BadgeIcon as={ArrowRightIcon} />
        </Badge>
      )}
      <HStack className="justify-between">
        <Heading className="text-white font-bold" size="md">
          {data.description}
        </Heading>
        {!topBadgeText && (
          <Button
            onPress={() => setShowOptions(true)}
            className="bg-neutral-300 rounded-full w-[30px] h-[30px]"
          >
            <ButtonIcon as={ChevronDownIcon} size="sm" />
          </Button>
        )}
        <Actionsheet isOpen={showOptions} onClose={handleClose}>
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <ActionsheetItem onPress={handleEditClass}>
              <ActionsheetItemText className="text-white text-md">
                Editar aula
              </ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem onPress={handleClose}>
              <ActionsheetItemText className="text-white text-md">
                Excluir aula
              </ActionsheetItemText>
            </ActionsheetItem>
          </ActionsheetContent>
        </Actionsheet>
      </HStack>
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
