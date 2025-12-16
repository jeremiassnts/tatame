import useGraduation from "@/src/api/use-graduation";
import { useUsers } from "@/src/api/use-users";
import { SelectInput } from "@/src/components/select-input";
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
import { BELTS } from "@/src/constants/belts";
import { queryClient } from "@/src/lib/react-query";
import { getBeltDegrees } from "@/src/utils/belt";
import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import z from "zod";

const createGraduationFormSchema = z.object({
  belt: z.string().min(1, "A faixa é obrigatória"),
  degree: z.number().min(0, "O grau é obrigatório").max(10, "O grau é obrigatório"),
});

export default function CreateGraduation() {
  const router = useRouter();
  const { getUserByClerkUserId } = useUsers();
  const { user } = useUser();
  const [isCreatingGraduation, setIsCreatingGraduation] = useState(false);
  const { createGraduation } = useGraduation();
  const { mutateAsync: createGraduationFn } = createGraduation;
  const [degrees, setDegrees] = useState<{ value: string; label: string }[]>([]);
  const {
    watch,
    setValue,
    register,
    setFocus,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<z.infer<typeof createGraduationFormSchema>>({
    resolver: zodResolver(createGraduationFormSchema),
    defaultValues: {
      belt: "",
      degree: undefined
    },
  });

  async function handleCreateGraduation(
    data: z.infer<typeof createGraduationFormSchema>
  ) {
    if (!user?.id) return;
    setIsCreatingGraduation(true);
    const sp_user = await getUserByClerkUserId(user.id);
    createGraduationFn({
      userId: sp_user?.id,
      belt: data.belt,
      degree: data.degree,
      modality: "jiu-jitsu",
    })
      .then(() => {
        reset();
        queryClient.invalidateQueries({ queryKey: ["graduation"] });
        router.replace("/(logged)/(profile)")
      })
      .catch(() => {
        setIsCreatingGraduation(false);
      })
      .finally(() => {
        setIsCreatingGraduation(false);
      });
  }

  const belt = watch("belt");
  const degree = watch("degree");

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
        <VStack className="pt-10 gap-2">
          <VStack className="pb-2">
            <Heading className="text-white" size="xl">
              Cadastro de graduação
            </Heading>
            <Text className="text-neutral-400 text-md">
              Preencha as informações para o cadastro da graduação
            </Text>
          </VStack>
          <SelectInput
            options={BELTS}
            selectedValue={belt}
            placeholder="Selecione a faixa"
            onValueChange={(value) => {
              setValue("belt", value)
              const beltDegrees = getBeltDegrees(value)
              setDegrees(beltDegrees)
            }}
            error={errors.belt?.message}
          />
          <SelectInput
            options={degrees}
            selectedValue={degree?.toString()}
            placeholder="Selecione o grau"
            onValueChange={(value) => setValue("degree", Number(value))}
            disabled={!belt}
            error={errors.degree?.message}
          />
          <Button
            action="primary"
            onPress={handleSubmit(handleCreateGraduation)}
            className="mt-4 bg-violet-800"
            disabled={isCreatingGraduation}
          >
            {isCreatingGraduation && <ButtonSpinner color="white" />}
            {!isCreatingGraduation && (
              <ButtonText className="text-white">Cadastrar</ButtonText>
            )}
            {!isCreatingGraduation && (
              <ButtonIcon as={AddIcon} size="md" color="white" />
            )}
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
