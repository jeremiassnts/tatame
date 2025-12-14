import { Database } from "@/src/types/database.types";
import { useUser } from "@clerk/clerk-expo";
import { useMemo } from "react";
import AvatarWithDialog from "../ui/avatar/avatar-with-dialog";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface HomeGymHeaderProps {
  gym: Database["public"]["Tables"]["gyms"]["Row"] | undefined | null;
}

export function HomeGymHeader({ gym }: HomeGymHeaderProps) {
  const { user } = useUser();

  const shift = useMemo(() => {
    const now = new Date();
    const shift = now.getHours();
    if (shift > 4 && shift < 13) return "BOM DIA";
    if (shift > 12 && shift < 18) return "BOA TARDE";
    return "BOA NOITE";
  }, []);

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
        <AvatarWithDialog
          fullName={user?.fullName ?? ""}
          imageUrl={user?.imageUrl ?? ""}
          size="lg"
          className="bg-neutral-800"
          avatarImageClassName="border-2 border-neutral-900"
        />
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
