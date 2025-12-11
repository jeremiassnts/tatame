import { useAttachments } from "@/src/api/use-attachments";
import { useGyms } from "@/src/api/use-gyms";
import { useUsers } from "@/src/api/use-users";
import DateTimePicker from "@/src/components/date-time-picker";
import ImageViewer from "@/src/components/image-picker";
import { SelectInput } from "@/src/components/select-input";
import { TextInput } from "@/src/components/text-input";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { AddIcon, ArrowLeftIcon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useToast } from "@/src/hooks/use-toast";
import { queryClient } from "@/src/lib/react-query";
import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import z from "zod";

const selectGymFormSchema = z.object({
  gymId: z.number().min(1, "A academia é obrigatória"),
});
type SelectGymFormSchema = z.infer<typeof selectGymFormSchema>;

export default function SelectGym() {
  const { fetchAll, associateGym } = useGyms();
  const { data: gyms, isLoading: isLoadingGyms } = fetchAll;
  const { mutateAsync: associateGymFn, isPending: isAssociatingGym } =
    associateGym;
  const router = useRouter();
  const { user } = useUser();
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<SelectGymFormSchema>({
    resolver: zodResolver(selectGymFormSchema),
    defaultValues: {
      gymId: 0,
    },
  });

  async function handleSelectGym(data: SelectGymFormSchema) {
    if (!user?.id) return;
    associateGymFn(data.gymId)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["gym-by-user", user?.id] });
        queryClient.invalidateQueries({ queryKey: ["next-class"] });
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        reset();
        router.replace("/(logged)/(home)/home");
      })
      .catch((err) => {
        console.log(JSON.stringify(err, null, 2));
      });
  }

  return (
    <SafeAreaView className="p-5">
      <VStack className="items-start gap-6">
        <Button
          action="secondary"
          onPress={() => router.back()}
          className="bg-neutral-800"
        >
          <ButtonIcon as={ArrowLeftIcon} />
        </Button>
      </VStack>
      <ScrollView>
        <VStack className="gap-2">
          <VStack className="pt-8 pb-2">
            <Heading className="text-white" size="xl">
              Seleção de academia
            </Heading>
            <Text className="text-neutral-400 text-md">
              Selecione a academia que você irá treinar
            </Text>
          </VStack>
          {!isLoadingGyms && gyms && gyms.length > 0 && (
            <SelectInput
              options={gyms.map((gym) => ({
                label: `${gym.name} - ${gym.address}`,
                value: gym.id.toString(),
              }))}
              placeholder="Selecione a academia"
              error={errors.gymId?.message}
              onValueChange={(value) => setValue("gymId", Number(value))}
            />
          )}
          <Button
            action="primary"
            onPress={handleSubmit(handleSelectGym)}
            className="mt-4 bg-violet-800"
            disabled={isAssociatingGym}
          >
            {isAssociatingGym && <ButtonSpinner color="white" />}
            {!isAssociatingGym && (
              <ButtonText className="text-white">Selecionar</ButtonText>
            )}
            {!isAssociatingGym && (
              <ButtonIcon as={AddIcon} size="md" color="white" />
            )}
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
