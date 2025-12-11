import useGraduation from "@/src/api/use-graduation";
import { BELT_COLORS } from "@/src/constants/belts";
import { useRouter } from "expo-router";
import { Box } from "../ui/box";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { AddIcon } from "../ui/icon";
import { Skeleton } from "../ui/skeleton";
import { VStack } from "../ui/vstack";

interface GraduationCardProps {
  showBelt?: boolean;
}

export function GraduationCard({ showBelt }: GraduationCardProps) {
  const { getGraduation } = useGraduation();
  const { data: graduation, isLoading: isLoadingGraduation } = getGraduation;
  const router = useRouter();

  function handleCreateGraduation() {
    router.push("/(logged)/(profile)/create-graduation");
  }

  function handleUpdateGraduation() {
    router.push({
      pathname: "/(logged)/(profile)/update-graduation",
      params: {
        id: graduation?.id,
        belt: graduation?.belt,
        degree: graduation?.degree,
      },
    })
  }

  // @ts-ignore
  const beltColor = graduation ? BELT_COLORS[graduation?.belt] : "#FFFFFF";

  return (
    <Box className="w-full items-center justify-center">
      <Skeleton
        isLoaded={!isLoadingGraduation}
        className="w-full h-[70px] bg-neutral-800 rounded-md mt-4"
      ></Skeleton>
      {!isLoadingGraduation && !graduation && (
        <Box className="w-full bg-neutral-800 rounded-md h-[70px] items-center justify-center mt-4">
          <Button
            onPress={handleCreateGraduation}
          >
            <ButtonIcon as={AddIcon} />
            <ButtonText>Cadastrar graduação</ButtonText>
          </Button>
        </Box>
      )}
      {!isLoadingGraduation && graduation && showBelt && (
        <VStack>
          <HStack className="w-[200px] h-[20px] border-[1px] border-neutral-800 rounded-sm mt-2">
            <Box className="flex-1" style={{ backgroundColor: beltColor }} />
            <HStack
              className={`w-[25%] justify-evenly ${graduation.belt === "black" ? "bg-red-800" : "bg-neutral-900"
                }`}
            >
              {Array.from({ length: graduation.degree ?? 0 }).map((_, index) => (
                <Box key={index} className="w-[4px] h-full bg-white" />
              ))}
            </HStack>
            <Box className="w-[5%]" style={{ backgroundColor: beltColor }} />
          </HStack>
          <Button variant="link" onPress={handleUpdateGraduation}>
            <ButtonText className="text-neutral-400 text-md font-normal">Atualizar graduação</ButtonText>
          </Button>
        </VStack>
      )}
    </Box>
  );
}
