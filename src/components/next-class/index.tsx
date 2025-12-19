import { useClass } from "@/src/api/use-class";
import { useUsers } from "@/src/api/use-users";
import { Database } from "@/src/types/database.types";
import { useRouter } from "expo-router";
import { ClassCard } from "../class-card";
import { Box } from "../ui/box";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { AddIcon, ClockIcon, Icon } from "../ui/icon";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface NextClassProps {
  gym: Database["public"]["Tables"]["gyms"]["Row"] | undefined | null;
  isLoadingGym: boolean;
}

export function NextClass({ gym, isLoadingGym }: NextClassProps) {
  const router = useRouter();
  const { fetchNextClass } = useClass();
  const { data: nextClass, isLoading: isLoadingNextClass } = fetchNextClass;
  const { getUserProfile, getStudentsApprovalStatus } = useUsers();
  const { data: userProfile, isLoading: isLoadingUserProfile } = getUserProfile;
  const { data: studentsApprovalStatus } = getStudentsApprovalStatus

  if (gym && !studentsApprovalStatus) {
    return (
      <Card className="bg-neutral-800 w-full">
        <HStack className="items-center gap-3 justify-center p-4">
          <Icon as={ClockIcon} />
          <Text>Aguardando a aprovação do seu professor para ver as próximas aulas</Text>
        </HStack>
      </Card>
    )
  }

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
