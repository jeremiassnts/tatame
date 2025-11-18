import { useCheckins } from "@/src/api/use-checkins";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "../ui/button";
import { CircleIcon } from "../ui/icon";
import { useState } from "react";
import { useUsers } from "@/src/api/use-users";
import { useUser } from "@clerk/clerk-expo";
import { ClassRow } from "@/src/types/extendend-database.types";
import { queryClient } from "@/src/lib/react-query";

interface CheckInProps {
  role: string | null | undefined;
  class: ClassRow;
}

export function CheckIn({ role, class: classData }: CheckInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { create } = useCheckins();
  const { mutateAsync: createCheckinFn } = create;
  const { getUserByClerkUserId } = useUsers();
  const { user } = useUser();

  async function handleCreateCheckin() {
    setIsLoading(true);
    const sp_userId = await getUserByClerkUserId(user?.id!);
    if (!sp_userId) {
      setIsLoading(false);
      return;
    }

    createCheckinFn({
      classId: classData.id,
      date: new Date().toISOString(),
      userId: sp_userId.id,
    })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        queryClient.invalidateQueries({ queryKey: ["next-class"] });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  if (role !== "STUDENT") return null;
  return (
    <Button
      className="bg-neutral-300 rounded-xl"
      variant="solid"
      onPress={handleCreateCheckin}
      disabled={isLoading}
    >
      <ButtonIcon as={CircleIcon} size="sm" />
      {isLoading && <ButtonSpinner />}
      {!isLoading && (
        <ButtonText className="text-neutral-900">Vou comparecer</ButtonText>
      )}
    </Button>
  );
}
