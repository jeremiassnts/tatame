import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import TextInput from "~/src/components/ui/text-input";
import DateTimePicker from "~/src/components/ui/date-time-picker";
import ImageViewer from "~/src/components/ui/image-viewer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormStageFooter from "~/src/components/form-stage-footer";
import { useRouter } from "expo-router";
import { useSignUpContext } from "~/src/providers/sign-up-provider";

const gymCreationFormSubmitSchema = z.object({
  gymName: z
    .string()
    .min(3, "O nome da academia deve ter no mínimo 3 caracteres"),
  gymCreationDate: z.date({
    required_error: "A data de criação é obrigatória",
  }),
  gymLogo: z.string().min(1, "A logo da academia é obrigatória"),
  gymCep: z.string().min(1, "Preencha o CEP"),
  gymAddressNumber: z.number().min(1, "Preencha o número"),
  gymStreet: z.string().min(1, "Preencha a rua"),
  gymNeighborhood: z.string().min(1, "Preencha o bairro"),
  gymCity: z.string().min(1, "Preencha a cidade"),
  gymState: z.string().min(1, "Preencha o estado"),
});
export type GymCreationFormSubmit = z.infer<typeof gymCreationFormSubmitSchema>;

export default function GymCreation() {
  const router = useRouter();
  const { handleUpdateForm, currentStep, stepsCount, handleUpdateCurrentStep } =
    useSignUpContext<GymCreationFormSubmit>();
  const {
    register,
    setValue,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<GymCreationFormSubmit>({
    resolver: zodResolver(gymCreationFormSubmitSchema),
    defaultValues: {
      gymName: "",
      gymCreationDate: undefined,
      gymLogo: "",
      gymCep: "",
      gymAddressNumber: 0,
      gymStreet: "",
      gymNeighborhood: "",
      gymCity: "",
      gymState: "",
    },
  });

  function onSubmit(data: GymCreationFormSubmit) {
    handleUpdateForm(data);
    handleUpdateCurrentStep(currentStep + 1);
    router.navigate("/(sign-up)/user-creation");
  }

  return (
    <KeyboardAvoidingView
      className="bg-neutral-900 flex-1"
      enabled={true}
      behavior="padding"
    >
      <View className="pt-4">
        <Text className="font-sora-bold text-white text-[20px]">
          Cadastro de academia
        </Text>
        <Text className="font-sora text-neutral-400 text-[14px]">
          Para iniciar o cadastro do gestor, precisamos conhecer mais sobre sua
          academia
        </Text>
      </View>
      <ScrollView className="flex flex-col mt-2 h-full mb-16">
        <TextInput
          placeholder="Digite o nome da academia"
          error={errors?.gymName?.message}
          name="gymName"
          onChangeText={(text: string) => setValue("gymName", text)}
          returnKeyType="next"
          register={register("gymName")}
        />
        <DateTimePicker
          setNewDate={(date: Date | undefined) => {
            if (date) {
              setValue("gymCreationDate", date);
            }
          }}
          placeholder="Data de criação"
          error={errors?.gymCreationDate?.message}
        />
        <ImageViewer
          placeholder="Envie a logo da academia"
          setRemoteImage={(image: string) => setValue("gymLogo", image)}
          error={errors?.gymLogo?.message}
        />
        <View className="flex flex-col gap-2">
          <Text className="font-sora text-neutral-400 text-[14px] mt-4 mb-1 text-left">
            Endereço
          </Text>
          <View className="flex flex-row gap-2">
            <TextInput
              placeholder="Digite o CEP"
              error={errors?.gymCep?.message}
              name="gymCep"
              onChangeText={(text: string) => setValue("gymCep", text)}
              viewClassName="flex-1"
              returnKeyType="next"
              keyboardType="numeric"
              onSubmitEditing={() =>
                setFocus("gymAddressNumber", { shouldSelect: true })
              }
              register={register("gymCep")}
            />
            <TextInput
              placeholder="Número"
              error={errors?.gymAddressNumber?.message}
              name="gymAddressNumber"
              onChangeText={(text: string) =>
                setValue("gymAddressNumber", parseInt(text))
              }
              keyboardType="numeric"
              returnKeyType="next"
              register={register("gymAddressNumber")}
              onSubmitEditing={() =>
                setFocus("gymStreet", { shouldSelect: true })
              }
            />
          </View>
          <View className="flex flex-row gap-2">
            <TextInput
              placeholder="Rua"
              error={errors?.gymStreet?.message}
              name="gymStreet"
              onChangeText={(text: string) => setValue("gymStreet", text)}
              viewClassName="w-[50%]"
              register={register("gymStreet")}
              returnKeyType="next"
              onSubmitEditing={() =>
                setFocus("gymNeighborhood", { shouldSelect: true })
              }
            />
            <TextInput
              placeholder="Bairro"
              error={errors?.gymNeighborhood?.message}
              name="gymNeighborhood"
              onChangeText={(text: string) => setValue("gymNeighborhood", text)}
              viewClassName="w-[50%]"
              register={register("gymNeighborhood")}
              returnKeyType="next"
              onSubmitEditing={() =>
                setFocus("gymCity", { shouldSelect: true })
              }
            />
          </View>
          <View className="flex flex-row gap-2">
            <TextInput
              placeholder="Cidade"
              error={errors?.gymCity?.message}
              name="gymCity"
              onChangeText={(text: string) => setValue("gymCity", text)}
              viewClassName="w-[50%]"
              register={register("gymCity")}
              returnKeyType="next"
              onSubmitEditing={() =>
                setFocus("gymState", { shouldSelect: true })
              }
            />
            <TextInput
              placeholder="Estado"
              error={errors?.gymState?.message}
              name="gymState"
              onChangeText={(text: string) => setValue("gymState", text)}
              viewClassName="w-[50%]"
              register={register("gymState")}
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView>
      <FormStageFooter
        stage={currentStep}
        stageCount={stepsCount}
        handleSubmit={handleSubmit(onSubmit)}
      />
    </KeyboardAvoidingView>
  );
}
