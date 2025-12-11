import { Database } from "@/src/types/database.types";
import { Box } from "../ui/box";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { useRouter } from "expo-router";
import { AddIcon } from "../ui/icon";
import { HStack } from "../ui/hstack";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";

interface ProfileGymCardProps {
  gym: Database["public"]["Tables"]["gyms"]["Row"] | undefined | null;
}

export function ProfileGymCard({ gym }: ProfileGymCardProps) {
  const router = useRouter();

  if (!gym) {
    return (
      <Box className="w-full bg-neutral-800 rounded-md h-[80px] items-center justify-center mt-2">
        <Button onPress={() => router.push("/(logged)/(home)/select-gym")}>
          <ButtonIcon as={AddIcon} />
          <ButtonText>Selecionar academia</ButtonText>
        </Button>
      </Box>
    );
  }

  return (
    <HStack className="bg-neutral-800 w-full p-5 rounded-md gap-4 items-center justify-center mt-4">
      <Avatar size="lg">
        <AvatarFallbackText>{gym.name}</AvatarFallbackText>
        <AvatarImage
          source={{
            uri: `${process.env.EXPO_PUBLIC_R2_URL}${gym.logo}`,
          }}
        />
      </Avatar>
      <VStack className="justify-center items-start">
        <Text className="text-white text-lg font-bold">{gym.name}</Text>
        <Text className="text-neutral-400 text-md">{gym.address}</Text>
      </VStack>
    </HStack>
  );
}
