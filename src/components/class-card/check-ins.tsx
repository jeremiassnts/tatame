import { useListCheckinsByClassId } from "@/src/api/checkins/list-checkins-by-class-id";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { HStack } from "../ui/hstack";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";

interface CheckInsProps {
  classId: number;
  date: string;
}

export function CheckIns({ classId, date }: CheckInsProps) {
  const { data: checkins, isLoading: isLoadingCheckins } =
    useListCheckinsByClassId(classId, date);
  if (isLoadingCheckins) {
    return (
      <Skeleton className="w-full h-[30px] bg-neutral-700 rounded-md mt-2 mb-2" />
    );
  }
  if (!date) return null;
  return (
    <HStack className="items-baseline">
      <HStack className="mt-2 mb-2 flex-row-reverse justify-end items-center">
        {checkins?.slice(0, 10).map((checkin) => (
          <Avatar key={checkin.id} size="xs" className="mr-[-5px]">
            <AvatarFallbackText>{checkin.name}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: checkin.imageUrl,
              }}
            />
          </Avatar>
        ))}
      </HStack>
      {checkins && checkins.length > 10 && (
        <Text className="text-neutral-400 text-md ml-5">
          +{checkins.length - 10}
        </Text>
      )}
    </HStack>
  );
}
