import { Database } from "@/src/types/database.types";
import { useRouter } from "expo-router";
import AvatarWithDialog from "../ui/avatar/avatar-with-dialog";
import { Box } from "../ui/box";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { AddIcon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

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
      <AvatarWithDialog fullName={gym.name} imageUrl={`${process.env.EXPO_PUBLIC_R2_URL}${gym.logo}`} size="lg" />
      <VStack className="justify-center items-start max-w-[80%]">
        <Text className="text-white text-lg font-bold">{gym.name}</Text>
        <Text className="text-neutral-400 text-md">{gym.address}</Text>
      </VStack>
    </HStack>
  );
}
