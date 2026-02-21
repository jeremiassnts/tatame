import { useCheckins } from "@/src/api/checkins/use-checkins";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { queryClient } from "@/src/lib/react-query";
import { Class } from "@/src/types/models";
import { differenceInHours } from "date-fns";
import { CheckCircleIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface CheckInProps {
  class: Class;
  classDate?: string;
}

export function CheckIn({ class: classData, classDate }: CheckInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { create, fetchAllByClassId, remove } = useCheckins();
  const { mutateAsync: createCheckinFn } = create();
  const { data: checkins, isLoading: isLoadingCheckins } = fetchAllByClassId(
    classData.id,
  );
  const { mutateAsync: removeCheckinFn } = remove();
  const [date, setDate] = useState<Date | null>(null);
  const { user } = useProfileContext();

  if (!classDate) return null;

  async function handleCreateCheckin() {
    setIsLoading(true);

    createCheckinFn({
      classId: classData.id,
      date: new Date().toISOString(),
      userId: user?.id ?? 0,
    })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        queryClient.invalidateQueries({ queryKey: ["next-class"] });
        queryClient.invalidateQueries({ queryKey: ["checkins"] });
        queryClient.invalidateQueries({
          queryKey: ["checkins-by-class-id", classData.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["just-checkins-by-class-id", classData.id],
        });
        queryClient.invalidateQueries({ queryKey: ["last-checkins"] });
        queryClient.invalidateQueries({ queryKey: ["last-week-checkins"] });

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  async function handleDeleteCheckin() {
    const checkin = checkins?.find(
      (checkin) => checkin.classId === classData.id,
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
        queryClient.invalidateQueries({
          queryKey: ["checkins-by-class-id", classData.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["just-checkins-by-class-id", classData.id],
        });
        queryClient.invalidateQueries({ queryKey: ["last-checkins"] });
        queryClient.invalidateQueries({ queryKey: ["last-week-checkins"] });

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    const hour = classData.end?.split(":")[0];
    const minute = classData.end?.split(":")[1];
    const temp = new Date(`${classDate}`);
    temp.setHours(Number(hour), Number(minute));
    setDate(temp);
  }, [classDate, classData.end]);

  if (!date || differenceInHours(date, new Date()) > 24) return null;

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
  } else {
    return (
      <Button
        variant="solid"
        action="primary"
        size="sm"
        onPress={handleCreateCheckin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ButtonSpinner />
        ) : (
          <ButtonText className="text-xs">CHECK-IN</ButtonText>
        )}
      </Button>
    );
  }
}
