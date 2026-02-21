import { useGetNextClass } from "@/src/api/classes/get-next-class";
import { useIsHigherRole } from "@/src/api/roles/is-higher-role";
import { useIsLowerRole } from "@/src/api/roles/is-lower-role";
import { useIsMediumRole } from "@/src/api/roles/is-medium-role";
import { useListStudentsApprovalStatus } from "@/src/api/users/list-students-approval-status";
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
  const { user, isLoading: isLoadingUser } = useProfileContext();
  const isHigherRole = useIsHigherRole();
  const isLowerRole = useIsLowerRole();
  const isMediumRole = useIsMediumRole();
  const { data: nextClass, isLoading: isLoadingNextClass } = useGetNextClass();
  const { data: studentsApprovalStatus } = useListStudentsApprovalStatus();

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
