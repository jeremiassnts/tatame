import { useClasses } from "@/src/api/classes/use-classes";
import { useRoles } from "@/src/api/roles/use-roles";
import { useUsers } from "@/src/api/users/use-users";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { Gym } from "@/src/types/models";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
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
  gym: Gym | undefined | null;
  isLoadingGym: boolean;
}

export function NextClass({ gym, isLoadingGym }: NextClassProps) {
  const router = useRouter();
  const { fetchNextClass } = useClasses();
  const { user, isLoading: isLoadingUser } = useProfileContext();
  const { data: nextClass, isLoading: isLoadingNextClass } = fetchNextClass(
    user?.id ?? 0,
  );
  const { getStudentsApprovalStatus } = useUsers();
  const { data: studentsApprovalStatus } = getStudentsApprovalStatus();
  const { isHigherRole, isMediumRole, isLowerRole } = useRoles();

  if (gym && !studentsApprovalStatus && !isHigherRole()) {
    return (
      <Card className="bg-neutral-800 w-full">
        <HStack className="items-center gap-3 justify-center p-4">
          <Icon as={ClockIcon} />
          <Text>
            Aguardando a aprovação do seu{" "}
            {isLowerRole() ? "professor" : "gestor"} para{" "}
            {isLowerRole() ? "ver as próximas aulas" : "gerenciar as aulas"}
          </Text>
        </HStack>
      </Card>
    );
  }

  return (
    <VStack className="w-full">
      <Skeleton
        className="h-[150px] w-full bg-neutral-800 rounded-md"
        speed={4}
        isLoaded={!isLoadingNextClass && !isLoadingUser}
      />
      {gym &&
        !isLoadingNextClass &&
        !isLoadingGym &&
        !nextClass &&
        user &&
        isHigherRole() && (
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
          <Pressable onPress={() => router.push(`/(logged)/(schedule)`)}>
            <ClassCard
              data={nextClass}
              topBadgeText="Próxima aula"
              currentClass={false}
            />
          </Pressable>
        </Box>
      )}
      {!gym && !isLoadingNextClass && user && isHigherRole() && (
        <Box className="w-full bg-neutral-800 rounded-md h-[150px] items-center justify-center">
          <Button onPress={() => router.push("/(logged)/(home)/create-gym")}>
            <ButtonIcon as={AddIcon} />
            <ButtonText>Cadastrar academia</ButtonText>
          </Button>
        </Box>
      )}
      {!gym && !isLoadingNextClass && user && isMediumRole() && (
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
