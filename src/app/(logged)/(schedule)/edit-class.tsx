import { useClass } from "@/src/api/use-class";
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
import {
  ArrowLeftIcon,
  CheckIcon,
  EditIcon,
} from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Days } from "@/src/constants/date";
import { Modalities } from "@/src/constants/modalities";
import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import z from "zod";
import { ClassRow } from "@/src/types/extendend-database.types";
import { Skeleton } from "@/src/components/ui/skeleton";
import { queryClient } from "@/src/lib/react-query";

const createClassFormSchema = z.object({
  description: z.string().min(1, "A descrição da aula é obrigatória"),
  start: z.string().min(1, "O horário de início é obrigatório"),
  end: z.string().min(1, "O horário de término é obrigatório"),
  days: z.array(z.string()).min(1, "Selecione pelo menos um dia"),
  modality: z.string().min(1, "A modalidade é obrigatória"),
});

export default function EditClass() {
  const { classId } = useLocalSearchParams<{
    classId: string;
  }>();
  const { fetchClassById, editClass } = useClass();
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState<ClassRow | null>(null);
  const { mutateAsync: editClassFn, isPending: isEditingClass } = editClass;
  const router = useRouter();
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

  async function handleEditClass(data: z.infer<typeof createClassFormSchema>) {
    if (!user?.id) return;

    try {
      await editClassFn({
        description: data.description,
        start: data.start,
        end: data.end,
        day: data.days[0],
        modality: data.modality,
        id: classData?.id,
        instructor_id: classData?.instructor_id,
        gym_id: classData?.gym_id,
        created_by: classData?.created_by,
        created_at: classData?.created_at,
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      router.replace("/(logged)/(schedule)");
    } catch {}
  }

  useEffect(() => {
    async function fetchClass() {
      const classData = await fetchClassById(parseInt(classId));
      if (classData) {
        setClassData(classData);
        setValue("description", classData.description ?? "");
        setValue("start", classData.start ?? "");
        setValue("end", classData.end ?? "");
        setValue("modality", classData.modality ?? "");
        setValue("days", classData.day ? [classData.day] : []);
      }
      setIsLoading(false);
    }
    fetchClass();
  }, []);

  function formatTime(time: string) {
    const template = `${new Date().toISOString().split("T")[0]} ${time}`;
    const date = parse(template, "yyyy-MM-dd HH:mm:ss", new Date());
    return date;
  }

  const description = watch("description");
  const modality = watch("modality");
  const start = watch("start");
  const end = watch("end");
  const days = watch("days");

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
      {isLoading && (
        <VStack className="gap-4 pt-10">
          <Skeleton className="w-full h-[50px] rounded-md bg-neutral-800" />
          <Skeleton className="w-full h-[20px] rounded-md bg-neutral-800" />
          <Skeleton className="w-full h-[50px] rounded-md bg-neutral-800" />
          <Skeleton className="w-full h-[50px] rounded-md bg-neutral-800" />
          <Skeleton className="w-full h-[50px] rounded-md bg-neutral-800" />
        </VStack>
      )}
      {!isLoading && (
        <ScrollView>
          <VStack className="pt-10 gap-2">
            <VStack className="pb-2">
              <Heading className="text-white" size="xl">
                Edição de aula
              </Heading>
              <Text className="text-neutral-400 text-md">
                Preencha as informações para a edição da aula
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
              selectedValue={modality}
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
                value={formatTime(start)}
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
                value={formatTime(end)}
              />
            </HStack>
            <TextInput
              value={"Instrutor: " + (classData?.instructor_name ?? "")}
              readOnly
              isDisabled
            />
            <Heading className="mt-2" size="md">
              Selecione os dias da semana
            </Heading>
            <CheckboxGroup
              value={days}
              onChange={(keys) => {
                const [_, lastDay] = keys;
                setValue("days", [lastDay]);
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
              onPress={handleSubmit(handleEditClass)}
              className="mt-4 bg-violet-800"
              disabled={isEditingClass}
            >
              {isEditingClass && <ButtonSpinner color="white" />}
              {!isEditingClass && (
                <ButtonText className="text-white">Salvar</ButtonText>
              )}
              {!isEditingClass && (
                <ButtonIcon as={EditIcon} size="md" color="white" />
              )}
            </Button>
          </VStack>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
