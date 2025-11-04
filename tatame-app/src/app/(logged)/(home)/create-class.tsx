import { useClass } from "@/src/api/use-class";
import { useGyms } from "@/src/api/use-gyms";
import { useUsers } from "@/src/api/use-users";
import DateTimePicker from "@/src/components/date-time-picker";
import { SelectInput } from "@/src/components/select-input";
import { TextInput } from "@/src/components/text-input";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/src/components/ui/button";
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/src/components/ui/checkbox";
import { Grid, GridItem } from "@/src/components/ui/grid";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { AddIcon, ArrowLeftIcon, CheckIcon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Days } from "@/src/constants/date";
import { Modalities } from "@/src/constants/modalities";
import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import z from "zod";

const createClassFormSchema = z.object({
  description: z.string().min(1, "A descrição da aula é obrigatória"),
  start: z.string().min(1, "O horário de início é obrigatório"),
  end: z.string().min(1, "O horário de término é obrigatório"),
  days: z.array(z.string()).min(1, "Selecione pelo menos um dia"),
  modality: z.string().min(1, "A modalidade é obrigatória"),
});

export default function CreateClass() {
  const router = useRouter();
  const { createClass } = useClass();
  const { fetchGymByManagerId } = useGyms();
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const { getUserByClerkUserId } = useUsers();
  const { user } = useUser();
  const {
    watch,
    setValue,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<z.infer<typeof createClassFormSchema>>({
    resolver: zodResolver(createClassFormSchema),
    defaultValues: {
      description: "",
      start: "",
      end: "",
      days: [],
      modality: "",
    },
  });

  async function handleCreateClass(
    data: z.infer<typeof createClassFormSchema>
  ) {
    if (!user?.id) return;
    setIsCreatingClass(true);
    const sp_user = await getUserByClerkUserId(user.id);
    const sp_gym = await fetchGymByManagerId(sp_user?.id);

    const promises = data.days.map(
      async (day) =>
        await createClass({
          description: data.description,
          start: data.start,
          end: data.end,
          day: day,
          gym_id: sp_gym?.id,
          instructor_id: sp_user?.id,
          modality: data.modality,
          created_by: sp_user?.id,
        })
    );

    await Promise.all(promises)
      .then(() => {
        setIsCreatingClass(false);
        reset();
        router.replace("/(logged)/(home)");
      })
      .catch(() => {
        setIsCreatingClass(false);
      });
  }

  const description = watch("description");
  const days = watch("days");

  return (
    <SafeAreaView className="p-10">
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
              Cadastro de aula
            </Heading>
            <Text className="text-neutral-400 text-md">
              Preencha as informações para o cadastro da aula
            </Text>
          </VStack>
          <TextInput
            value={description}
            onChangeText={(text) => {
              setValue("description", text);
            }}
            placeholder="Digite a descrição da aula"
            error={errors.description?.message}
            {...register("description")}
            returnKeyType="next"
          />
          <SelectInput
            options={Modalities.map((modality) => ({
              label: modality.name,
              value: modality.value,
            }))}
            placeholder="Selecione a modalidade"
            error={errors?.modality?.message}
            onValueChange={(value) => {
              setValue("modality", value);
            }}
          />
          <HStack className="gap-2 items-center justify-center">
            <DateTimePicker
              setNewDate={(date: Date | undefined) => {
                if (date) {
                  setValue("start", format(date, "HH:mm"));
                }
              }}
              placeholder="Início"
              error={errors?.start?.message}
              mode="time"
              className="w-[49%]"
            />
            <DateTimePicker
              setNewDate={(date: Date | undefined) => {
                if (date) {
                  setValue("end", format(date, "HH:mm"));
                }
              }}
              placeholder="Término"
              error={errors?.end?.message}
              mode="time"
              className="w-[49%]"
            />
          </HStack>
          <TextInput
            value={"Instrutor: " + (user?.fullName ?? "")}
            readOnly
            isDisabled
          />
          <Heading className="mt-2" size="md">
            Selecione os dias da semana
          </Heading>
          <CheckboxGroup
            value={days}
            onChange={(keys) => {
              setValue("days", keys);
            }}
          >
            <Grid _extra={{ className: "grid-cols-2" }} className="gap-2">
              {Days.map((day) => (
                <GridItem key={day.value} _extra={{ className: "" }}>
                  <Checkbox key={day.value} value={day.value}>
                    <CheckboxIndicator>
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel>{day.label}</CheckboxLabel>
                  </Checkbox>
                </GridItem>
              ))}
            </Grid>
          </CheckboxGroup>
          {errors?.days?.message && (
            <Text className="text-red-500 text-sm">
              {errors?.days?.message}
            </Text>
          )}
          <Button
            action="primary"
            onPress={handleSubmit(handleCreateClass)}
            className="mt-4 bg-violet-800"
            disabled={isCreatingClass}
          >
            {isCreatingClass && <ButtonSpinner color="white" />}
            {!isCreatingClass && (
              <ButtonText className="text-white">Cadastrar</ButtonText>
            )}
            {!isCreatingClass && (
              <ButtonIcon as={AddIcon} size="md" color="white" />
            )}
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
