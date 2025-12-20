import { useClass } from "@/src/api/use-class";
import { queryClient } from "@/src/lib/react-query";
import { ClassRow } from "@/src/types/extendend-database.types";
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
  role: string | null | undefined;
  data: ClassRow;
}

export function Actions({ topBadgeText, role, data }: ActionsProps) {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const { deleteClass } = useClass();
  const { mutateAsync: deleteClassFn } = deleteClass;

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

  async function handleDeleteClass() {
    await deleteClassFn(data.id);
    queryClient.invalidateQueries({ queryKey: ["classes"] });
    queryClient.invalidateQueries({ queryKey: ["next-class"] });
    queryClient.invalidateQueries({ queryKey: ["class", data.id] });
    handleClose();
  }

  function handleDetailsClass() {
    router.push(`/(logged)/(schedule)/${data.id}`);
    handleClose();
  }

  if (topBadgeText || role !== "MANAGER") return null;
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
          <ActionsheetItem onPress={handleDetailsClass}>
            <ActionsheetItemText className="text-white text-md">
              Detalhes
            </ActionsheetItemText>
          </ActionsheetItem>
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
