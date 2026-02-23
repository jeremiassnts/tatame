import { useDeleteClass } from "@/src/api/classes/delete-class";
import { queryClient } from "@/src/lib/react-query";
import { Class } from "@/src/types/models";
import { useRouter } from "expo-router";
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
import { Button, ButtonIcon } from "../ui/button";
import { ChevronDownIcon } from "../ui/icon";

interface ActionsProps {
  topBadgeText?: string;
  isHigherRole: boolean;
  data: Class;
  classDate?: string;
}

export function Actions({
  topBadgeText,
  isHigherRole,
  data,
  classDate,
}: ActionsProps) {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const { mutateAsync: deleteClassFn } = useDeleteClass();

  function handleClose() {
    setShowOptions(false);
  }

  function handleEditClass() {
    router.push({
      pathname: "/(logged)/(schedule)/edit-class",
      params: {
        classId: data.id,
        gymId: data.gymId,
      },
    });
    handleClose();
  }

  async function handleDeleteClass() {
    await deleteClassFn(data.id);
    queryClient.invalidateQueries({ queryKey: ["classes"] });
    queryClient.invalidateQueries({ queryKey: ["next-class"] });
    queryClient.invalidateQueries({ queryKey: ["class", data.id] });
    handleClose();
  }

  function handleDetailsClass() {
    if (!classDate) return;

    router.push({
      pathname: "/(logged)/(schedule)/[classId]",
      params: {
        classId: data.id,
        classDate: classDate,
      },
    });
    handleClose();
  }

  if (topBadgeText || !isHigherRole) return null;
  return (
    <Button
      onPress={() => setShowOptions(true)}
      className="bg-neutral-300 rounded-full w-[30px] h-[30px]"
    >
      <ButtonIcon as={ChevronDownIcon} size="sm" />
      <Actionsheet isOpen={showOptions} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {classDate && (
            <ActionsheetItem onPress={handleDetailsClass}>
              <ActionsheetItemText className="text-white text-md">
                Detalhes
              </ActionsheetItemText>
            </ActionsheetItem>
          )}
          <ActionsheetItem onPress={handleEditClass}>
            <ActionsheetItemText className="text-white text-md">
              Editar aula
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleDeleteClass}>
            <ActionsheetItemText className="text-white text-md">
              Excluir aula
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </Button>
  );
}
