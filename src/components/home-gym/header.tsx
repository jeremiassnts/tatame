import useGraduation from "@/src/api/use-graduation";
import { BELT_COLORS } from "@/src/constants/belts";
import { Database } from "@/src/types/database.types";
import { useUser } from "@clerk/clerk-expo";
import { useMemo } from "react";
import AvatarWithDialog from "../ui/avatar/avatar-with-dialog";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface HomeGymHeaderProps {
  gym: Database["public"]["Tables"]["gyms"]["Row"] | undefined | null;
}

export function HomeGymHeader({ gym }: HomeGymHeaderProps) {
  const { user } = useUser();
  const { getGraduation } = useGraduation();
  const { data: graduation, isLoading: isLoadingGraduation } = getGraduation;

  const shift = useMemo(() => {
    const now = new Date();
    const shift = now.getHours();
    if (shift > 4 && shift < 13) return "BOM DIA";
    if (shift > 12 && shift < 18) return "BOA TARDE";
    return "BOA NOITE";
  }, []);

  // @ts-ignore
  const beltColor = graduation ? BELT_COLORS[graduation.belt] : "#FFFFFF";

  return (
    <HStack className="gap-3 items-center">
      <HStack className="flex-row-reverse">
        {gym && (
          <AvatarWithDialog
            fullName={gym.name}
            imageUrl={`${process.env.EXPO_PUBLIC_R2_URL}${gym.logo}`}
            size="lg"
            className="bg-neutral-800 ml-[-30px]"
            avatarImageClassName="border-2 border-neutral-900"
          />
        )}
        <VStack className="items-center">
          <AvatarWithDialog
            fullName={user?.fullName ?? ""}
            imageUrl={user?.imageUrl ?? ""}
            size="lg"
            className="bg-neutral-800"
            avatarImageClassName="border-2 border-neutral-900"
          />
          {graduation && (<HStack className="items-center justify-center border-[1px] border-neutral-600 mt-[-8px] h-3">
            <Box className="w-6 h-full" style={{ backgroundColor: beltColor }} />
            <Box className={`w-2 h-full ${graduation.belt === "black" ? "bg-red-800" : "bg-neutral-900"}`} />
          </HStack>)}
        </VStack>
      </HStack>
      <VStack>
        <Text className="text-md font-medium text-white uppercase">
          {shift},
        </Text>
        <Text className="text-xl font-black text-white uppercase">
          {user?.fullName}
        </Text>
      </VStack>
    </HStack>
  );
}
