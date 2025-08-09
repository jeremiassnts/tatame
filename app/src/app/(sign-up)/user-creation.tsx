import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";
import TextInput from "~/src/components/ui/text-input";
import DateTimePicker from "~/src/components/ui/date-time-picker";
import ImageViewer from "~/src/components/ui/image-viewer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormStageFooter from "~/src/components/form-stage-footer";
import { useRouter } from "expo-router";
import { Label } from "~/src/components/ui/label";
import { Checkbox } from "~/src/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "~/src/components/ui/radio-group";
import ErrorLabel from "~/src/components/ui/error-label";
import fetchUserIdByEmail from "~/src/api/fetch-user-id-by-email";
import { useState } from "react";
import { useSignUpContext } from "~/src/providers/sign-up-provider";

const userCreationFormSubmitSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z
    .string()
    .email({
      message: "O email deve ser válido",
    })
    .min(1, "O email é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
  photo: z.string(),
  isProfessor: z.boolean(),
  birthDate: z.date({
    required_error: "A data de nascimento é obrigatória",
  }),
  gender: z.string().min(1, "O gênero é obrigatório"),
});
export type UserCreationFormSubmit = z.infer<
  typeof userCreationFormSubmitSchema
>;

export default function UserCreation() {
  const router = useRouter();
  const {
    handleUpdateForm,
    currentStep,
    stepsCount,
    handleUpdateCurrentStep,
    userType,
  } = useSignUpContext<UserCreationFormSubmit>();
  const {
    register,
    setValue,
    handleSubmit,
    setFocus,
    watch,
    formState: { errors },
  } = useForm<UserCreationFormSubmit>({
    resolver: zodResolver(userCreationFormSubmitSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      photo: "",
      isProfessor: false,
      birthDate: undefined,
      gender: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: UserCreationFormSubmit) {
    setIsLoading(true);
    //verify if the email is already in use
    const userId = await fetchUserIdByEmail(data.email);
    if (userId) {
      Alert.alert("Email já em uso", "Por favor, use um email diferente");
      setFocus("email", { shouldSelect: true });
      setIsLoading(false);
      return;
    }
    handleUpdateForm(data);
    handleUpdateCurrentStep(currentStep + 1);
    router.navigate("/(sign-up)/graduation-creation");
    setIsLoading(false);
  }

  const isProfessor = watch("isProfessor");
  const gender = watch("gender");

  return (
    <KeyboardAvoidingView
      className="bg-neutral-900 flex-1"
      enabled={true}
      behavior="padding"
    >
      <View className="pt-4">
        <Text className="font-sora-bold text-white text-[20px]">
          Cadastro do{" "}
          {userType === "manager"
            ? "gestor"
            : userType === "instructor"
            ? "professor"
            : "aluno"}
        </Text>
        <Text className="font-sora text-neutral-400 text-[14px]">
          Nos conte um pouco sobre você
        </Text>
      </View>
      <ScrollView className="flex flex-col mt-2 h-full gap-2">
        <TextInput
          placeholder="Seu nome"
          error={errors?.name?.message}
          name="name"
          onChangeText={(text: string) => setValue("name", text)}
          returnKeyType="next"
          register={register("name")}
          onSubmitEditing={() => setFocus("email", { shouldSelect: true })}
          viewClassName="mt-2"
        />
        <TextInput
          placeholder="Seu e-mail"
          error={errors?.email?.message}
          name="email"
          onChangeText={(text: string) => setValue("email", text)}
          returnKeyType="next"
          register={register("email")}
          onSubmitEditing={() => setFocus("password", { shouldSelect: true })}
          viewClassName="mt-2 mb-2"
        />
        <TextInput
          placeholder="Sua senha"
          error={errors?.password?.message}
          name="password"
          onChangeText={(text: string) => setValue("password", text)}
          returnKeyType="next"
          register={register("password")}
          viewClassName="mb-2"
          secureTextEntry={true}
        />
        {userType === "manager" && (
          <View className="flex-row gap-3 items-center justify-start mt-2">
            <Checkbox
              aria-labelledby="isProfessor"
              checked={isProfessor}
              onCheckedChange={(value) => setValue("isProfessor", value)}
            />
            <Label
              className="font-sora text-[14px] text-neutral-300"
              nativeID="isProfessor"
              onPress={() => setValue("isProfessor", !isProfessor)}
            >
              Também sou professor
            </Label>
          </View>
        )}
        <ImageViewer
          placeholder="Envie uma foto para seu perfil"
          setRemoteImage={(image: string) => setValue("photo", image)}
          error={errors?.photo?.message}
        />
        <DateTimePicker
          setNewDate={(date: Date | undefined) => {
            if (date) {
              setValue("birthDate", date);
            }
          }}
          placeholder="Data de nascimento"
          error={errors?.birthDate?.message}
        />
        <View className="mt-3">
          <Label className="font-sora text-[14px] text-neutral-300">
            Selecione seu gênero
          </Label>
          <RadioGroup
            value={gender}
            onValueChange={(value) => setValue("gender", value)}
            className="gap-3 flex flex-row items-center justify-start mt-2"
          >
            <View className="flex flex-row items-center justify-start gap-2">
              <RadioGroupItem aria-labelledby={`male`} value="m" />
              <Label className="font-sora text-neutral-300 text-[14px]">
                Masculino
              </Label>
            </View>
            <View className="flex flex-row items-center justify-start gap-2">
              <RadioGroupItem aria-labelledby={`female`} value="f" />
              <Label className="font-sora text-neutral-300 text-[14px]">
                Feminino
              </Label>
            </View>
          </RadioGroup>
          <ErrorLabel error={errors?.gender?.message} />
        </View>
      </ScrollView>
      <FormStageFooter
        stage={currentStep}
        stageCount={stepsCount}
        handleSubmit={handleSubmit(onSubmit)}
        enabled={!isLoading}
      />
    </KeyboardAvoidingView>
  );
}
