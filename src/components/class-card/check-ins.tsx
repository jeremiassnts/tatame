import { useCheckins } from "@/src/api/use-checkins";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { HStack } from "../ui/hstack";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";

interface CheckInsProps {
  classId: number;
}

export function CheckIns({ classId }: CheckInsProps) {
  const { fetchByClassId } = useCheckins();
  const { data: checkins, isLoading: isLoadingCheckins } = fetchByClassId(classId);

  if (isLoadingCheckins) {
    return <Skeleton className="w-full h-[30px] bg-neutral-700 rounded-md mt-2 mb-2" />;
  }
  return (
    <HStack className="items-baseline">
      <HStack className="mt-2 flex-row-reverse justify-end items-center">
        {checkins?.slice(0, 10).map((checkin) => (
          <Avatar key={checkin.id} size="sm" className="mr-[-10px]">
            <AvatarFallbackText>{checkin.name}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: checkin.imageUrl,
              }}
            />
          </Avatar>
        ))}
      </HStack>
      {checkins?.length && checkins.length > 10 && (
        <Text className="text-neutral-400 text-md ml-5">
          +{checkins.length - 10}
        </Text>
      )}
    </HStack>
  );
}
