import Icon from "@react-native-vector-icons/feather";
import { differenceInMinutes, formatDate, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import colors from "tailwindcss/colors";
import { useAuthentication } from "../providers/authentication-provider";
import { useRouter } from "expo-router";
import { CardAction } from "./card-action";
import { DialogCardAction } from "./dialog-card-action";
import { useMutation } from "@tanstack/react-query";
import { deleteClass } from "../api/delete-class";
import { queryClient } from "../lib/react-query";
import cancelClass from "../api/cancel-class";
import uncancelClass from "../api/uncancel-class";
import { Button } from "./ui/button";
import { createCheckIn } from "../api/create-check-in";

interface ClassProps {
  id: string;
  modalityName: string;
  timeStart: Date;
  timeEnd: Date;
  name: string;
  description: string;
  address: string;
  day: Date | undefined;
  instructorId: string;
  modalityId: string;
  weekDay: string;
  instructorName: string;
  gymName: string;
  cancellations: Date[];
  refetch: () => void;
}

export default function ClassCard({
  id,
  modalityName,
  timeStart,
  timeEnd,
  name,
  description,
  address,
  day,
  instructorId,
  modalityId,
  weekDay,
  instructorName,
  gymName,
  cancellations,
  refetch,
}: ClassProps) {
  const classDuration = differenceInMinutes(timeEnd, timeStart);
  const router = useRouter();
  const { getSession } = useAuthentication();
  const { mutate: deleteClassFn, isPending: isDeletingClass } = useMutation({
    mutationFn: async () => {
      const session = await getSession();
      return deleteClass(id, session?.accessToken ?? "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      refetch();
    },
    onError: (err) => {
      console.log(err);
      Alert.alert("Erro", "Erro ao excluir a aula");
    },
  });
  const { mutate: createCheckInFn, isPending: isCreatingCheckIn } = useMutation({
    mutationFn: async () => {
      const session = await getSession();
      return createCheckIn({
        classId: id,
        referenceDate: new Date(day ?? new Date()),
        token: session?.accessToken ?? "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      refetch();
    },
    onError: (err) => {
      console.log(err);
      Alert.alert("Erro", "Erro ao criar check-in");
    },
  });
  const { mutate: cancelClassFn, isPending: isCancellingClass } = useMutation({
    mutationFn: async () => {
      const session = await getSession();
      return cancelClass({
        classId: id,
        token: session?.accessToken ?? "",
        referenceDate: new Date(day ?? new Date()).toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      refetch();
    },
    onError: (err) => {
      console.log(err);
      Alert.alert("Erro", "Erro ao cancelar a aula");
    },
  });
  const { mutate: uncancelClassFn, isPending: isUncancellingClass } = useMutation({
    mutationFn: async () => {
      const session = await getSession();
      return uncancelClass({
        classId: id,
        token: session?.accessToken ?? "",
        referenceDate: new Date(day ?? new Date()).toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      refetch();
    },
    onError: (err) => {
      console.log(err);
      Alert.alert("Erro", "Erro ao restaurar a aula");
    },
  });

  function handleEditClass() {
    router.push({
      pathname: "/(dashboard)/(schedule)/edit-class",
      params: {
        id,
        name,
        description,
        timeStart: new Date(timeStart).toISOString(),
        timeEnd: new Date(timeEnd).toISOString(),
        day: formatDate(day ?? new Date(), "yyyy-MM-dd"),
        instructorId,
        address,
        modalityId,
        weekDay,
      },
    });
  }

  function handleDeleteClass() {
    deleteClassFn();
  }

  function handleCancelClass() {
    cancelClassFn();
  }

  function handleUncancelClass() {
    uncancelClassFn();
  }

  function handleCreateCheckIn() {
    createCheckInFn();
  }

  function handleViewClass() {
    if (isDeletingClass || isCancellingClass || isCreatingCheckIn) return;
    router.push({
      pathname: "/(dashboard)/(schedule)/[classId]",
      params: { classId: id, day: day?.toISOString() },
    });
  }

  const isCancelled = cancellations.some((cancellation) => {
    const cancellationDate = new Date(cancellation);
    return isSameDay(cancellationDate, day ?? new Date());
  });

  return (
    <Pressable onPress={handleViewClass}>
      {isCancelled && (
        <View className="flex flex-row gap-1 items-baseline pt-1 pl-2 pr-2 pb-1 bg-neutral-950 rounded-xl ml-2 justify-center max-w-[120px] border-[1px] border-neutral-800 border-solid z-50 absolute top-3 left-1">
          <Icon name="x" size={12} color={colors.neutral[200]} />
          <Text className="font-sora text-neutral-200 text-[12px]">
            Cancelado
          </Text>
        </View>
      )}
      <View
        className={`flex flex-col rounded-lg bg-neutral-800 min-w-full min-h-[150px] ${
          isCancelled ? "opacity-50" : ""
        }`}
      >
        {(isDeletingClass || isCancellingClass || isUncancellingClass || isCreatingCheckIn) && (
          <View className="absolute w-full h-full z-20 bg-neutral-900 opacity-60 flex justify-center items-center">
            <ActivityIndicator size={50} color={"rgb(139 92 246)"} />
          </View>
        )}
        {!isCancelled && (
          <DialogCardAction
            icon="x"
            onConfirm={handleCancelClass}
            right={80}
            title="Cancelar aula"
            description="Tem certeza que deseja cancelar a aula?"
          />
        )}
        {isCancelled && (
          <DialogCardAction
            icon="check"
            onConfirm={handleUncancelClass}
            right={80}
            title="Restaurar aula"
            description="Tem certeza que deseja restaurar a aula?"
          />
        )}
        <DialogCardAction
          icon="trash"
          onConfirm={handleDeleteClass}
          right={45}
          title="Excluir aula"
          description="Tem certeza que deseja excluir a aula?"
        />
        <CardAction icon="edit" onPress={handleEditClass} right={10} />
        <Image
          source={require("~/assets/images/jiujitsu.webp")}
          resizeMode="cover"
          className="w-full h-[120px]"
          style={{
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            opacity: 0.8,
          }}
        />
        <View className="mt-[-30px] flex flex-row gap-1">
          <View className="flex flex-row gap-1 items-baseline pt-1 pl-2 pr-2 pb-1 bg-neutral-950 rounded-xl ml-2 justify-center max-w-[120px] border-[1px] border-neutral-800 border-solid">
            <Icon name="user" size={12} color={colors.neutral[200]} />
            <Text className="font-sora text-neutral-200 text-[12px]">
              {instructorName}
            </Text>
          </View>
          <View className="flex flex-row gap-1 items-baseline pt-1 pl-2 pr-2 pb-1 bg-neutral-800 rounded-xl ml-2 justify-center max-w-[120px] border-[1px] border-neutral-700 border-solid">
            <Text className="font-sora text-neutral-200 text-[12px]">
              {modalityName}
            </Text>
          </View>
        </View>
        <View className="flex flex-col p-3 gap-1 pb-4">
          <View className="flex flex-col align-top justify-start">
            <Text className="text-white text-[18px] text-left font-sora-bold">
              {name}
            </Text>
            {description && (
              <Text className="text-neutral-400 text-[14px] text-left font-sora">
                {description}
              </Text>
            )}
          </View>
          <View className="flex flex-col gap-1">
            <View className="flex flex-row gap-1 justify-start items-baseline">
              <Icon name="clock" size={16} color={colors.neutral[400]} />
              <Text className="text-neutral-400 text-[14px] font-sora">
                {formatDate(timeStart, "HH:mm", { locale: ptBR })}
                {" - "}
                {classDuration}
                {" min"}
              </Text>
            </View>
            <View className="flex flex-row gap-1 justify-start items-baseline">
              <Icon name="map-pin" size={16} color={colors.neutral[400]} />
              <Text className="text-neutral-400 text-[14px] font-sora">
                {gymName}
              </Text>
            </View>
            <View className="flex flex-row gap-1 justify-start items-baseline">
              <Icon name="users" size={16} color={colors.neutral[400]} />
              <Text className="text-neutral-400 text-[14px] font-sora">
                15 check-ins
              </Text>
            </View>
          </View>
          <Button className="flex flex-row gap-1 justify-center items-baseline bg-neutral-300 mt-4" onPress={handleCreateCheckIn}>
            <Icon name="check-circle" size={16} color={colors.neutral[900]} />
            <Text className="text-neutral-900 text-[14px] font-sora">Eu vou</Text>
          </Button>
        </View>
      </View>
    </Pressable>
  );
}
