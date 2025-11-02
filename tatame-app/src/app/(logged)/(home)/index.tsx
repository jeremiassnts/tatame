import { useGyms } from "@/src/api/use-gyms";
import { useUsers } from "@/src/api/use-users";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { HStack } from "@/src/components/ui/hstack";
import { AddIcon } from "@/src/components/ui/icon";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Database } from "@/src/types/database.types";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const { fetchGymByManagerId } = useGyms();
  const { getUserByClerkUserId } = useUsers();
  const [gym, setGym] = useState<
    Database["public"]["Tables"]["gyms"]["Row"] | null
  >(null);
  const [isLoadingGym, setIsLoadingGym] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id) {
        const sp_user = await getUserByClerkUserId(user.id);
        if (sp_user) {
          const gym = await fetchGymByManagerId(sp_user.id);
          setGym(gym);
        }
      }
      setIsLoadingGym(false);
    };
    fetchUser();
  }, [user?.id]);

  const shift = useMemo(() => {
    const now = new Date();
    const shift = now.getHours();
    if (shift > 4 && shift < 13) return "BOM DIA";
    if (shift > 12 && shift < 18) return "BOA TARDE";
    return "BOA NOITE";
  }, []);

  console.log(`${process.env.EXPO_PUBLIC_R2_URL}${gym?.logo}`);

  return (
    <SafeAreaView className="p-10">
      <VStack className="items-start gap-6">
        <Badge size="lg" variant="solid" action="muted" className="rounded-sm">
          <BadgeText>Home</BadgeText>
        </Badge>
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
        <VStack className="w-full">
          <Skeleton
            className="h-[150px] w-full bg-neutral-800 rounded-md"
            speed={4}
            isLoaded={!isLoadingGym}
          />
          {gym && !isLoadingGym && <HStack></HStack>}
          {!gym && !isLoadingGym && (
            <Box className="w-full bg-neutral-800 rounded-md h-[150px] items-center justify-center">
              <Button
                onPress={() => router.push("/(logged)/(home)/create-gym")}
              >
                <ButtonIcon as={AddIcon} />
                <ButtonText>Cadastrar academia</ButtonText>
              </Button>
            </Box>
          )}
        </VStack>
      </VStack>
    </SafeAreaView>
  );
}
