import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";
import TextInput from "~/src/components/ui/text-input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormStageFooter from "~/src/components/form-stage-footer";
import { useRouter } from "expo-router";
import ErrorLabel from "~/src/components/ui/error-label";
import { useEffect, useState } from "react";
import { Button } from "~/src/components/ui/button";
import FormSelect from "~/src/components/ui/form-select";
import Icon from "@react-native-vector-icons/feather";
import { useQuery } from "@tanstack/react-query";
import fetchModalities from "~/src/api/fetch-modalitites";
import fetchColors from "~/src/api/fetch-colors";
import { useSignUpContext } from "~/src/providers/sign-up-provider";
import { UserType } from "~/src/constants/user-type";
import fetchGyms from "~/src/api/fetch-gyms";

const graduationCreationFormSchema = z.object({
  graduations: z
    .array(
      z.object({
        modality: z.string(),
        color: z.string(),
        extras: z.string().optional(),
        label: z.string().optional(),
      })
    )
    .min(1, "A graduação é obrigatória"),
  gymId: z.string().optional(),
});
export type GraduationCreationFormSubmit = z.infer<
  typeof graduationCreationFormSchema
>;

interface Graduation {
  modality: string;
  color: string;
  extras?: string;
  label: string;
}

export default function GraduationCreation() {
  const router = useRouter();
  const [graduation, setGraduation] = useState<Graduation>({
    modality: "",
    color: "",
    extras: "",
    label: "",
  });
  const [graduationError, setGraduationError] = useState<string | undefined>();
  const { handleUpdateForm } = useSignUpContext();
  const { handleUpdateCurrentStep, currentStep, stepsCount, userType } =
    useSignUpContext<GraduationCreationFormSubmit>();
  const {
    setValue,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<GraduationCreationFormSubmit>({
    resolver: zodResolver(graduationCreationFormSchema),
    defaultValues: {
      graduations: [],
      gymId: "",
    },
  });
  const { data: modalities, isLoading: isLoadingModalities } = useQuery({
    queryKey: ["modalities"],
    queryFn: fetchModalities,
  });
  const {
    data: colors,
    isLoading: isLoadingColors,
    refetch: refetchColors,
    isRefetching: isRefetchingColors,
  } = useQuery({
    queryKey: ["colors"],
    queryFn: () => fetchColors({ modality: graduation.modality }),
  });
  const { data: gyms, isLoading: isLoadingGyms } = useQuery({
    queryKey: ["gyms"],
    queryFn: fetchGyms,
  });

  useEffect(() => {
    refetchColors();
  }, [graduation.modality]);

  function onSubmit(data: GraduationCreationFormSubmit) {
    if (userType !== UserType.MANAGER && !gymId) {
      setError("gymId", { message: "A academia é obrigatória" });
      return;
    }
    handleUpdateForm(data);
    handleUpdateCurrentStep(currentStep + 1);
    if (userType === UserType.MANAGER) {
      router.navigate("/(sign-up)/subscription");
    } else {
      router.navigate("/(sign-up)/conclusion");
    }
  }
  function handleNewGraduation() {
    if (!graduation.modality || !graduation.color) {
      setGraduationError("Preencha todos os campos");
      return;
    }
    if (graduations.some((g) => g.modality === graduation.modality)) {
      setGraduationError("Já existe uma graduação para essa modalidade");
      return;
    }

    const modality = modalities?.find((m) => m.id === graduation.modality);
    const color = colors?.find((c) => c.id === graduation.color);
    const label = modality?.name + " - " + color?.name;

    setGraduationError(undefined);
    setValue("graduations", [...graduations, { ...graduation, label }]);
    setGraduation({
      modality: "",
      color: "",
      extras: "",
      label: "",
    });
  }
  function handleRemoveGraduation(index: number) {
    const newGraduations = [...graduations];
    newGraduations.splice(index, 1);
    setValue("graduations", newGraduations);
  }

  const graduations = watch("graduations");
  const gymId = watch("gymId");

  return (
    <KeyboardAvoidingView
      className="bg-neutral-900 flex-1"
      enabled={true}
      behavior="padding"
    >
      {isLoadingModalities && (
        <ActivityIndicator
          size={70}
          color={"rgb(139 92 246)"}
          className="pt-[30%]"
        />
      )}
      {!isLoadingModalities && (
        <View className="pt-4">
          <Text className="font-sora-bold text-white text-[20px]">
            {userType === UserType.MANAGER
              ? "Graduações"
              : "Academia e Graduações"}
          </Text>
          <Text className="font-sora text-neutral-400 text-[14px]">
            {userType === UserType.MANAGER
              ? "Cadastre todas as suas graduações"
              : "Selecione a academia e cadastre todas as suas graduações"}
          </Text>
        </View>
      )}
      {!isLoadingModalities && (
        <ScrollView className="flex flex-col mt-2 h-full gap-2">
          <View className="flex flex-col gap-2 mb-5">
            {userType !== UserType.MANAGER && (
              <FormSelect
                items={
                  gyms
                    ? gyms?.map((g) => ({
                        label: g.name,
                        value: g.id,
                      }))
                    : []
                }
                label="gymId"
                placeholder="Selecione a academia"
                viewClassName="mb-2"
                onValueChange={(value) =>
                  setValue("gymId", value?.toString() ?? "")
                }
                selectedValue={watch("gymId")}
                loading={isLoadingGyms}
              />
            )}
            {graduations.map((graduation, index) => (
              <View
                key={graduation.modality}
                className="bg-neutral-800 rounded-md border-neutral-700 border-[1px] border-solid p-4 flex flex-row items-center justify-start gap-2"
              >
                <Icon name="bookmark" size={16} color={"#ffffff"} />
                <View className="flex flex-col items-start justify-center mr-auto">
                  <Text className="font-sora-bold text-neutral-200 text-[14px]">
                    {graduation.label}
                  </Text>
                  {graduation.extras && (
                    <Text className="font-sora text-neutral-400 text-[14px]">
                      {graduation.extras}
                    </Text>
                  )}
                </View>
                <Icon
                  name="x-circle"
                  size={16}
                  color={"#ffffff"}
                  onPress={() => handleRemoveGraduation(index)}
                />
              </View>
            ))}
          </View>
          <FormSelect
            items={
              modalities
                ? modalities?.map((m) => ({
                    label: m.name,
                    value: m.id,
                  }))
                : []
            }
            label="modality"
            placeholder="Selecione a modalidade"
            viewClassName="mb-2"
            onValueChange={(value) =>
              setGraduation({ ...graduation, modality: value?.toString() })
            }
            selectedValue={graduation.modality}
          />
          <FormSelect
            items={
              !colors
                ? []
                : colors?.map((m) => ({
                    label: m.name,
                    value: m.id,
                  }))
            }
            label="color"
            placeholder="Selecione a cor"
            viewClassName="mb-2"
            onValueChange={(value) => {
              setGraduation({ ...graduation, color: value?.toString() });
            }}
            enabled={
              !!graduation.modality && !isLoadingColors && !isRefetchingColors
            }
            selectedValue={graduation.color}
            loading={isLoadingColors || isRefetchingColors}
          />
          <TextInput
            placeholder="Informações extras (grau, dan, etc...)"
            name="extras"
            onChangeText={(text: string) =>
              setGraduation({ ...graduation, extras: text })
            }
            value={graduation.extras}
            viewClassName="flex-1 mb-2"
            onSubmitEditing={handleNewGraduation}
          />
          <ErrorLabel error={graduationError} />
          <ErrorLabel error={errors?.graduations?.message} />
          <ErrorLabel error={errors?.gymId?.message} />
          <Button
            className="w-[120px] bg-violet-800 rounded-xl"
            onPress={handleNewGraduation}
          >
            <Text className="text-white text-[14px] font-sora">Adicionar</Text>
          </Button>
        </ScrollView>
      )}
      {!isLoadingModalities && (
        <FormStageFooter
          stage={currentStep}
          stageCount={stepsCount}
          handleSubmit={handleSubmit(onSubmit)}
        />
      )}
    </KeyboardAvoidingView>
  );
}
