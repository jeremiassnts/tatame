import { useUser } from "@clerk/clerk-expo";
import { Badge, BadgeText } from "../ui/badge";
import { Box } from "../ui/box";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { AddIcon } from "../ui/icon";
import { Skeleton } from "../ui/skeleton";
import { VStack } from "../ui/vstack";
import { useRouter } from "expo-router";
import { useGyms } from "@/src/api/use-gyms";
import { useUsers } from "@/src/api/use-users";
import { useEffect, useState } from "react";
import { Database } from "@/src/types/database.types";
import { HomeGymHeader } from "./header";
import { useClass } from "@/src/api/use-class";
import { Text } from "../ui/text";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";

export function HomeGym() {
  const router = useRouter();
  const { user } = useUser();
  const { fetchGymByManagerId } = useGyms();
  const { getUserByClerkUserId } = useUsers();
  const [gym, setGym] = useState<
    Database["public"]["Tables"]["gyms"]["Row"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchNextClass } = useClass();
  const [nextClass, setNextClass] = useState<
    Database["public"]["Tables"]["class"]["Row"] | null
  >(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id) {
        const sp_user = await getUserByClerkUserId(user.id);
        if (sp_user) {
          const gym = await fetchGymByManagerId(sp_user.id);
          setGym(gym);
          if (gym) {
            const nextClass = await fetchNextClass(gym.id);
            setNextClass(nextClass);
          }
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [user?.id]);

  return (
    <VStack className="items-start gap-6">
      <Badge size="lg" variant="solid" action="muted" className="rounded-sm">
        <BadgeText>Home</BadgeText>
      </Badge>
      <HomeGymHeader gym={gym} />
      <VStack className="w-full">
        <Skeleton
          className="h-[150px] w-full bg-neutral-800 rounded-md"
          speed={4}
          isLoaded={!isLoading}
        />
        {gym && !isLoading && !nextClass && (
          <Box className="w-full bg-neutral-800 rounded-md h-[150px] items-center justify-center">
            <Button
              onPress={() => router.push("/(logged)/(home)/create-class")}
            >
              <ButtonIcon as={AddIcon} />
              <ButtonText>Cadastrar aula</ButtonText>
            </Button>
          </Box>
        )}
        {gym && !isLoading && nextClass && (
          <Card size="md" variant="elevated" className="m-3">
            <Heading size="md" className="mb-1">
              {nextClass.description}
            </Heading>
            <Text size="sm">{nextClass.start}</Text>
          </Card>
        )}
        {!gym && !isLoading && (
          <Box className="w-full bg-neutral-800 rounded-md h-[150px] items-center justify-center">
            <Button onPress={() => router.push("/(logged)/(home)/create-gym")}>
              <ButtonIcon as={AddIcon} />
              <ButtonText>Cadastrar academia</ButtonText>
            </Button>
          </Box>
        )}
      </VStack>
    </VStack>
  );
}
