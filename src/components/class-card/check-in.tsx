import { useCheckins } from "@/src/api/use-checkins";
import { useUsers } from "@/src/api/use-users";
import { queryClient } from "@/src/lib/react-query";
import { ClassRow } from "@/src/types/extendend-database.types";
import { useUser } from "@clerk/clerk-expo";
import { format } from "date-fns";
import { useState } from "react";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "../ui/button";
import { CheckCircleIcon, CircleIcon } from "../ui/icon";
import { Skeleton } from "../ui/skeleton";

interface CheckInProps {
  role: string | null | undefined;
  class: ClassRow;
}

export function CheckIn({ role, class: classData }: CheckInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { create, fetchAll, remove } = useCheckins();
  const { mutateAsync: createCheckinFn } = create;
  const { data: checkins, isLoading: isLoadingCheckins } = fetchAll;
  const { mutateAsync: removeCheckinFn } = remove;
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
        queryClient.invalidateQueries({ queryKey: ["checkins"] });
        queryClient.invalidateQueries({ queryKey: ["checkins-by-class-id", classData.id] });
        queryClient.invalidateQueries({ queryKey: ["last-checkins"] });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  async function handleDeleteCheckin() {
    const checkin = checkins?.find(
      (checkin) => checkin.classId === classData.id
    );
    if (!checkin) {
      return;
    }

    setIsLoading(true);
    removeCheckinFn(checkin.id)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        queryClient.invalidateQueries({ queryKey: ["next-class"] });
        queryClient.invalidateQueries({ queryKey: ["checkins"] });
        queryClient.invalidateQueries({ queryKey: ["checkins-by-class-id", classData.id] });
        queryClient.invalidateQueries({ queryKey: ["last-checkins"] });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  const currentDay = format(new Date(), "EEEE").toUpperCase()

  if (role !== "STUDENT" || currentDay !== classData.day) return null;

  if (isLoadingCheckins) {
    return <Skeleton className="w-full h-[40px] bg-neutral-700 rounded-md" />;
  }

  if (checkins?.some((checkin) => checkin.classId === classData.id)) {
    return (
      <Button
        className="rounded-xl"
        variant="solid"
        onPress={handleDeleteCheckin}
        disabled={isLoading}
        action="secondary"
      >
        {isLoading && <ButtonSpinner />}
        {!isLoading && <ButtonIcon as={CheckCircleIcon} size="md" />}
      </Button>
    );
  }

  return (
    <Button
      className="rounded-xl"
      variant="solid"
      onPress={handleCreateCheckin}
      disabled={isLoading}
      action="primary"
    >
      {isLoading && <ButtonSpinner />}
      {!isLoading && <ButtonIcon as={CircleIcon} size="md" />}
      {!isLoading && (
        <ButtonText className="text-neutral-900">Eu vou</ButtonText>
      )}
    </Button>
  );
}
