import { createClass } from "@/src/api/classes/create-class";
import DateTimePicker from "@/src/components/date-time-picker";
import IosTimePicker from "@/src/components/ios-time-picker";
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
import { AddIcon, CheckIcon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Days } from "@/src/constants/date";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { queryClient } from "@/src/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const createClassFormSchema = z.object({
  description: z.string().min(1, "A descrição da aula é obrigatória"),
  start: z.string().min(1, "O horário de início é obrigatório"),
  end: z.string().min(1, "O horário de término é obrigatório"),
  days: z.array(z.string()).min(1, "Selecione pelo menos um dia"),
});

export default function CreateClass() {
  const router = useRouter();
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const { mutateAsync: createClassFn } = createClass();
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
    },
  });
  const { user } = useProfileContext();

  async function handleCreateClass(
    data: z.infer<typeof createClassFormSchema>,
  ) {
    if (!user?.id) return;
    setIsCreatingClass(true);

    const promises = data.days.map((day) =>
      createClassFn({
        description: data.description,
        start: data.start,
        end: data.end,
        day: day,
        gym_id: user?.gym_id ?? 0,
        instructor_id: user?.id ?? 0,
        modality: "jiu-jitsu",
        created_by: user?.id ?? 0,
      }),
    );

    await Promise.all(promises)
      .then(() => {
        reset();
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        queryClient.invalidateQueries({ queryKey: ["next-class"] });
        router.replace("/(logged)/(schedule)");
      })
      .catch(() => {
        setIsCreatingClass(false);
      })
      .finally(() => {
        setIsCreatingClass(false);
      });
  }

  const description = watch("description");
  const days = watch("days");

  return (
    <SafeAreaView className="pl-5 pr-5">
      <ScrollView>
        <VStack className="gap-2">
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
          <TextInput value={"Modalidade: Jiu-Jitsu"} readOnly isDisabled />
          <HStack className="gap-2 items-center justify-center">
            {Platform.OS === "ios" ? (
              <IosTimePicker
                setNewDate={(date: Date | undefined) => {
                  if (date) {
                    setValue("start", format(date, "HH:mm"));
                  }
                }}
                placeholder="Início"
                error={errors?.start?.message}
                className="w-[49%]"
              />
            ) : (
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
            )}
            {Platform.OS == "ios" ? (
              <IosTimePicker
                setNewDate={(date: Date | undefined) => {
                  if (date) {
                    setValue("end", format(date, "HH:mm"));
                  }
                }}
                placeholder="Término"
                error={errors?.end?.message}
                className="w-[49%]"
              />
            ) : (
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
            )}
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
          <HStack className="gap-2 w-full items-center justify-center mt-4">
            <Button
              action="secondary"
              onPress={() => router.back()}
              className="bg-neutral-800"
            >
              <ButtonText>Voltar</ButtonText>
            </Button>
            <Button
              action="primary"
              onPress={handleSubmit(handleCreateClass)}
              className="bg-violet-800"
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
          </HStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
