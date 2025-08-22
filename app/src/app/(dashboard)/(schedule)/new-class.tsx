import { zodResolver } from "@hookform/resolvers/zod";
import Icon from "@react-native-vector-icons/feather";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, setHours, setMinutes } from "date-fns";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, SafeAreaView, ScrollView, Text, View } from "react-native";
import { z } from "zod";
import { createClasses } from "~/src/api/create-class";
import { fetchInstructorsByGym } from "~/src/api/fetch-instructors-by-gym";
import fetchModalities from "~/src/api/fetch-modalitites";
import getUserProfile from "~/src/api/get-user-profile";
import { Button } from "~/src/components/ui/button";
import { Checkbox } from "~/src/components/ui/checkbox";
import DateTimePicker from "~/src/components/ui/date-time-picker";
import ErrorLabel from "~/src/components/ui/error-label";
import FormSelect from "~/src/components/ui/form-select";
import { Label } from "~/src/components/ui/label";
import { Skeleton } from "~/src/components/ui/skeleton";
import TextInput from "~/src/components/ui/text-input";
import { DayOfWeek, weekDays } from "~/src/constants/week-days";
import { queryClient } from "~/src/lib/react-query";
import { useAuthentication } from "~/src/providers/authentication-provider";
import FormMultiSelector from "~/src/components/ui/form-multi-selector";
import { multiWeekDaysClassFormSchema } from "~/src/constants/schemas/class-schema";

export default function NewClass() {
  const router = useRouter();
  const { getSession } = useAuthentication();
  const { data: userProfile, isLoading: isLoadingUserProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { accessToken } = await getSession();
      return getUserProfile(accessToken ?? "");
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    watch,
    formState: { errors },
    getValues,
  } = useForm<z.infer<typeof multiWeekDaysClassFormSchema>>({
    resolver: zodResolver(multiWeekDaysClassFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      weekDays: [],
      instructorId: "",
      address: "",
      modalityId: "",
    },
  });
  const { data: instructors, isLoading: isLoadingInstructors } = useQuery({
    queryKey: ["instructors", userProfile?.gym.id],
    queryFn: async () => {
      const { accessToken } = await getSession();
      return fetchInstructorsByGym(
        userProfile?.gym.id ?? "",
        accessToken ?? ""
      );
    },
    enabled: !!userProfile?.gym.id,
  });
  const { data: modalities, isLoading: isLoadingModalities } = useQuery({
    queryKey: ["modalities", userProfile?.gym.id],
    queryFn: fetchModalities,
  });
  const { mutateAsync: createClassesFn, isPending: isCreatingClasses } =
    useMutation({
      mutationFn: createClasses,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        router.navigate("/(dashboard)/(schedule)");
      },
      onError: (error) => {
        console.log(error);
        Alert.alert("Erro ao cadastrar aulas", "Tente novamente mais tarde");
      },
    });
  const [isSameAddress, setIsSameAddress] = useState(false);

  function handleGoBack() {
    router.back();
  }

  function formatTime(time: string) {
    const [hours, minutes] = time.split(":");
    var date = setHours(new Date(), parseInt(hours));
    date = setMinutes(date, parseInt(minutes));
    return date;
  }

  async function onSubmit(data: z.infer<typeof multiWeekDaysClassFormSchema>) {
    const { accessToken } = await getSession();
    createClassesFn({
      data: {
        name: data.title,
        description: data.description ?? "",
        timeStart: formatTime(data.startTime),
        timeEnd: formatTime(data.endTime),
        daysOfWeek: data.weekDays as DayOfWeek[],
        address: data.address,
        gymId: userProfile?.gym.id!,
        userId: data.instructorId!,
        modalityId: data.modalityId,
      },
      token: accessToken!,
    });
  }

  function handleSameAddressChange(value: boolean) {
    setIsSameAddress(value);
    if (value) {
      setValue("address", userProfile?.gym.address!);
    } else {
      setValue("address", "");
    }
  }

  return (
    <SafeAreaView className="flex flex-1 bg-neutral-900 flex-col items-start justify-start pr-3 pl-3 pt-4">
      {isLoadingUserProfile && <Skeleton className="w-full h-[500px]" />}
      {!isLoadingUserProfile && (
        <View className="flex flex-row items-center justify-start">
          <Button
            onPress={handleGoBack}
            size={"icon"}
            className="rounded-full w-[36px] h-[36px] bg-neutral-800 flex items-center justify-center"
          >
            <Icon name="arrow-left" color={"#ffffff"} size={20} />
          </Button>
        </View>
      )}
      {!isLoadingUserProfile && (
        <View className="pt-4">
          <Text className="font-sora-bold text-white text-[20px]">
            Nova aula
          </Text>
          <Text className="font-sora text-neutral-400 text-[14px]">
            Preencha as informações para cadastrar uma nova aula
          </Text>
        </View>
      )}
      <ScrollView className="mb-4">
        {!isLoadingUserProfile && (
          <View className="w-full mt-3">
            <TextInput
              placeholder="Título"
              error={errors?.title?.message}
              name="title"
              onChangeText={(text: string) => setValue("title", text)}
              returnKeyType="next"
              register={register("title")}
              onSubmitEditing={() =>
                setFocus("description", { shouldSelect: true })
              }
              viewClassName="mt-2"
            />
            <TextInput
              placeholder="Descrição"
              error={errors?.description?.message}
              name="description"
              onChangeText={(text: string) => setValue("description", text)}
              returnKeyType="next"
              register={register("description")}
              viewClassName="mt-2"
            />
            <View className="flex flex-row gap-2 items-center justify-center">
              <DateTimePicker
                setNewDate={(date: Date | undefined) => {
                  if (date) {
                    setValue("startTime", format(date, "HH:mm"));
                  }
                }}
                placeholder="Início"
                error={errors?.startTime?.message}
                mode="time"
                className="w-[49%] mb-2"
              />
              <DateTimePicker
                setNewDate={(date: Date | undefined) => {
                  if (date) {
                    setValue("endTime", format(date, "HH:mm"));
                  }
                }}
                placeholder="Término"
                error={errors?.endTime?.message}
                mode="time"
                className="w-[49%] mb-2"
              />
            </View>
            <FormMultiSelector
              items={weekDays}
              placeholder="Selecione os dias da semana"
              onSelectedItemsChange={(items) => {
                const newWeekDays = items.map(
                  (item: unknown) => item as DayOfWeek
                );
                return setValue("weekDays", newWeekDays);
              }}
            />
            <ErrorLabel error={errors?.weekDays?.message} />
            <FormSelect
              items={
                instructors
                  ? instructors?.map((g) => ({
                      label: g.name,
                      value: g.id,
                    }))
                  : []
              }
              label="instructorId"
              placeholder="Selecione o instrutor"
              viewClassName="mb-2"
              onValueChange={(value) =>
                setValue("instructorId", value?.toString() ?? "")
              }
              selectedValue={watch("instructorId")}
              loading={isLoadingInstructors}
            />
            <ErrorLabel error={errors?.instructorId?.message} />
            <View className="flex-row gap-3 items-center justify-start mt-2 mb-3">
              <Checkbox
                aria-labelledby="isSameAddress"
                checked={isSameAddress}
                onCheckedChange={(value) => handleSameAddressChange(value)}
              />
              <Label
                className="font-sora text-[14px] text-neutral-300"
                nativeID="isSameAddress"
                onPress={() => handleSameAddressChange(!isSameAddress)}
              >
                Mesmo endereço da academia
              </Label>
            </View>
            <TextInput
              placeholder="Endereço"
              error={errors?.address?.message}
              name="address"
              onChangeText={(text: string) => setValue("address", text)}
              returnKeyType="next"
              register={register("address")}
              viewClassName="mb-2"
              editable={!isSameAddress}
              value={watch("address")}
            />
            <FormSelect
              items={
                modalities
                  ? modalities?.map((g) => ({
                      label: g.name,
                      value: g.id,
                    }))
                  : []
              }
              label="modalityId"
              placeholder="Selecione a modalidade"
              viewClassName="mb-2"
              onValueChange={(value) =>
                setValue("modalityId", value?.toString() ?? "")
              }
              selectedValue={watch("modalityId")}
              loading={isLoadingModalities}
            />
            <ErrorLabel error={errors?.modalityId?.message} />
          </View>
        )}
        {!isLoadingUserProfile && (
          <View className="flex flex-row items-center justify-end w-full">
            <Button
              size="default"
              className={`bg-violet-800`}
              onPress={handleSubmit(onSubmit)}
              disabled={isCreatingClasses}
            >
              <Text className="font-sora-bold text-[14px] text-white">
                Cadastrar
              </Text>
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
