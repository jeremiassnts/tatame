import Icon from "@react-native-vector-icons/feather";
import { useMutation, useQuery } from "@tanstack/react-query";
import { differenceInMinutes, formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Image, SafeAreaView, Text, View } from "react-native";
import colors from "tailwindcss/colors";
import { deleteClass } from "~/src/api/delete-class";
import { fetchClass } from "~/src/api/fetch-class";
import { CardAction } from "~/src/components/card-action";
import { DialogCardAction } from "~/src/components/dialog-card-action";
import ActionDialog from "~/src/components/ui/action-dialog";
import { Button } from "~/src/components/ui/button";
import { Dialog, DialogTrigger } from "~/src/components/ui/dialog";
import { Skeleton } from "~/src/components/ui/skeleton";
import { queryClient } from "~/src/lib/react-query";
import { useAuthentication } from "~/src/providers/authentication-provider";

export default function Class() {
  const router = useRouter();
  const { classId, day } = useLocalSearchParams<{
    classId: string;
    day: string;
  }>();
  const { getSession } = useAuthentication();
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });
  const { data, isLoading } = useQuery({
    queryKey: ["class", classId],
    queryFn: () => fetchClass(classId, session?.accessToken ?? ""),
  });
  const classDuration = differenceInMinutes(
    data?.timeEnd ?? new Date(),
    data?.timeStart ?? new Date()
  );
  const { mutate: deleteClassFn, isPending: isDeletingClass } = useMutation({
    mutationFn: async () => {
      if (!data) return;
      const session = await getSession();
      return deleteClass(data.id, session?.accessToken ?? "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      router.back();
    },
    onError: (err) => {
      console.log(err);
      Alert.alert("Erro", "Erro ao excluir a aula");
    },
  });

  function handleGoBack() {
    router.back();
  }

  function handleEditClass() {
    if (!data) return;
    router.push({
      pathname: "/(dashboard)/(schedule)/edit-class",
      params: {
        id: data?.id,
        name: data?.name,
        description: data?.description,
        timeStart: new Date(data?.timeStart).toISOString(),
        timeEnd: new Date(data?.timeEnd).toISOString(),
        day: formatDate(day ?? new Date(), "yyyy-MM-dd"),
        instructorId: data?.userId,
        address: data?.address,
        modalityId: data?.modalityId,
        weekDay: data?.dayOfWeek,
      },
    });
  }

  function handleDeleteClass() {
    deleteClassFn();
  }

  const formattedTimeStart = formatDate(
    data?.timeStart ?? new Date(),
    "HH:mm",
    {
      locale: ptBR,
    }
  );
  const formattedTimeEnd = formatDate(data?.timeEnd ?? new Date(), "HH:mm", {
    locale: ptBR,
  });

  return (
    <SafeAreaView className="flex flex-1 bg-neutral-900 flex-col items-start justify-start pt-4 pl-3 pr-3">
      {isLoading ||
        (isDeletingClass && (
          <View className="w-full h-full flex flex-col justify-start items-start gap-1">
            <Skeleton className="w-full h-[50px]" />
            <Skeleton className="w-full h-[500px] mt-4" />
          </View>
        ))}
      {!isLoading && (
        <View className="flex flex-col items-start justify-start w-full">
          <Button
            onPress={handleGoBack}
            size={"icon"}
            className="rounded-full w-[36px] h-[36px] bg-neutral-800 flex items-center justify-center"
          >
            <Icon name="arrow-left" color={"#ffffff"} size={20} />
          </Button>
          <Image
            source={require("~/assets/images/jiujitsu.webp")}
            resizeMode="cover"
            className="w-full h-[150px] mt-2 mb-2"
            style={{
              borderRadius: 5,
            }}
          />
          <Text className="text-white text-[18px] text-left font-sora-bold">
            {data?.name}
          </Text>
          {data?.description && (
            <Text className="text-neutral-400 text-[14px] text-left font-sora">
              {data?.description}
            </Text>
          )}
          <View className="flex flex-col gap-1 mt-4">
            <View className="flex flex-row gap-1 justify-start items-baseline">
              <Icon name="clock" size={16} color={colors.neutral[400]} />
              <Text className="text-neutral-400 text-[14px] font-sora">
                Das {formattedTimeStart} às {formattedTimeEnd} - {classDuration}{" "}
                minutos
              </Text>
            </View>
            <View className="flex flex-row gap-1 justify-start items-baseline">
              <Icon name="user" size={16} color={colors.neutral[400]} />
              <Text className="text-neutral-400 text-[14px] font-sora">
                {data?.instructorName} - {data?.modalityName}
              </Text>
            </View>
            <View className="flex flex-row gap-1 justify-start items-baseline">
              <Icon name="map-pin" size={16} color={colors.neutral[400]} />
              <Text className="text-neutral-400 text-[14px] font-sora">
                {data?.gymName} - {data?.address}
              </Text>
            </View>
            <View className="flex flex-row gap-1 justify-start items-baseline">
              <Icon name="users" size={16} color={colors.neutral[400]} />
              <Text className="text-neutral-400 text-[14px] font-sora">
                15 check-ins
              </Text>
            </View>
          </View>
          <View className="flex flex-row pt-4 gap-2">
            <Dialog>
              <ActionDialog
                title="Excluir aula"
                description="Tem certeza que deseja excluir a aula?"
                onConfirm={handleDeleteClass}
              />
              <DialogTrigger asChild>
                <Button className="flex flex-row gap-1 justify-start items-center bg-neutral-300">
                  <Icon name="trash" size={16} color={colors.neutral[900]} />
                  <Text className="font-sora text-[14px] text-neutral-900">
                    Excluir
                  </Text>
                </Button>
              </DialogTrigger>
            </Dialog>

            <Button
              className="flex flex-row gap-1 justify-start items-center bg-neutral-300"
              onPress={handleEditClass}
            >
              <Icon name="edit" size={16} color={colors.neutral[900]} />
              <Text className="font-sora text-[14px] text-neutral-900">
                Editar
              </Text>
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
