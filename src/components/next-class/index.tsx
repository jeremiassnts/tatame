import { useRouter } from "expo-router";
import { ClassCard } from "../class-card";
import { Box } from "../ui/box";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { AddIcon } from "../ui/icon";
import { Skeleton } from "../ui/skeleton";
import { VStack } from "../ui/vstack";
import { useClass } from "@/src/api/use-class";
import { Database } from "@/src/types/database.types";
import { useUsers } from "@/src/api/use-users";

interface NextClassProps {
  gym: Database["public"]["Tables"]["gyms"]["Row"] | undefined | null;
  isLoadingGym: boolean;
}

export function NextClass({ gym, isLoadingGym }: NextClassProps) {
  const router = useRouter();
  const { fetchNextClass } = useClass();
  const { data: nextClass, isLoading: isLoadingNextClass } = fetchNextClass;
  const { getUserProfile } = useUsers();
  const { data: userProfile, isLoading: isLoadingUserProfile } = getUserProfile;

  return (
    <VStack className="w-full">
      <Skeleton
        className="h-[150px] w-full bg-neutral-800 rounded-md"
        speed={4}
        isLoaded={!isLoadingNextClass && !isLoadingUserProfile}
      />
      {gym &&
        !isLoadingNextClass &&
        !isLoadingGym &&
        !nextClass &&
        userProfile &&
        userProfile.role !== "STUDENT" && (
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
      {!gym &&
        !isLoadingNextClass &&
        userProfile &&
        userProfile.role !== "STUDENT" && (
          <Box className="w-full bg-neutral-800 rounded-md h-[150px] items-center justify-center">
            <Button onPress={() => router.push("/(logged)/(home)/create-gym")}>
              <ButtonIcon as={AddIcon} />
              <ButtonText>Cadastrar academia</ButtonText>
            </Button>
          </Box>
        )}
        {!gym && !isLoadingNextClass && userProfile && userProfile.role === 'STUDENT' && (
          <Box className="w-full bg-neutral-800 rounded-md h-[150px] items-center justify-center">
            <Button onPress={() => router.push("/(logged)/(home)/select-gym")}>
              <ButtonIcon as={AddIcon} />
              <ButtonText>Selecionar academia</ButtonText>
            </Button>
          </Box>
        )}
    </VStack>
  );
}
