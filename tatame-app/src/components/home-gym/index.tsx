import { Badge, BadgeText } from "../ui/badge";
import { Box } from "../ui/box";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { AddIcon } from "../ui/icon";
import { Skeleton } from "../ui/skeleton";
import { VStack } from "../ui/vstack";
import { useRouter } from "expo-router";
import { useGyms } from "@/src/api/use-gyms";
import { HomeGymHeader } from "./header";
import { useClass } from "@/src/api/use-class";
import { ClassCard } from "../class-card";

export function HomeGym() {
  const router = useRouter();
  const { fetchNextClass } = useClass();
  const { data: nextClass, isLoading: isLoadingNextClass } = fetchNextClass;
  const { fetchByUser } = useGyms();
  const { data: gym, isLoading: isLoadingGym } = fetchByUser;

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
          isLoaded={!isLoadingNextClass}
        />
        {gym && !isLoadingNextClass && !isLoadingGym && !nextClass && (
          <Box className="w-full bg-neutral-800 rounded-md h-[150px] items-center justify-center">
            <Button
              onPress={() => router.push("/(logged)/(schedule)/create-class")}
            >
              <ButtonIcon as={AddIcon} />
              <ButtonText>Cadastrar aula</ButtonText>
            </Button>
          </Box>
        )}
        {gym && !isLoadingNextClass && !isLoadingGym && nextClass && (
          <Box>
            <ClassCard
              data={nextClass}
              topBadgeText="Próxima aula"
              currentClass={false}
            />
          </Box>
        )}
        {!gym && !isLoadingNextClass && (
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
