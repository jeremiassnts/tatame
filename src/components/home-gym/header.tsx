import { useUser } from "@clerk/clerk-expo";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { Database } from "@/src/types/database.types";
import { useMemo } from "react";

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
      <Avatar size="lg" className="bg-neutral-800 z-10">
        <AvatarImage
          className="border-2 border-neutral-900"
          source={{
            uri: user?.imageUrl,
          }}
        />
      </Avatar>
      {gym && (
        <Avatar size="lg" className="bg-neutral-800 ml-[-35px] z-0">
          {gym.logo && (
            <AvatarImage
              className="border-2 border-neutral-900"
              source={{
                uri: `${process.env.EXPO_PUBLIC_R2_URL}${gym.logo}`,
              }}
            />
          )}
          {!gym.logo && (
            <AvatarFallbackText className="text-white">
              {gym.name}
            </AvatarFallbackText>
          )}
        </Avatar>
      )}
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
