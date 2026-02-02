import { useCheckins } from "@/src/api/use-checkins";
import { useClass } from "@/src/api/use-class";
import { useRoles } from "@/src/api/use-roles";
import { useUsers } from "@/src/api/use-users";
import { ClassCard } from "@/src/components/class-card";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonIcon } from "@/src/components/ui/button";
import { AddIcon } from "@/src/components/ui/icon";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import WeekDays from "@/src/components/weekDays";
import { Days } from "@/src/constants/date";
import { useCrypto } from "@/src/hooks/use-crypto";
import { useToast } from "@/src/hooks/use-toast";
import { queryClient } from "@/src/lib/react-query";
import { WeekDay } from "@/src/types/date";
import { useUser } from "@clerk/clerk-expo";
import { addDays, endOfWeek, format, isAfter, isBefore, parse, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const qrCodeSchema = z.object({
  gymId: z.number(),
  date: z.string(),
});

export default function Schedule() {
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<WeekDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchClasses, findClassToCheckIn } = useClass();
  const { create } = useCheckins();
  const { mutateAsync: createCheckinFn } = create;
  const { data: classes, isLoading: isLoadingClasses, refetch: refetchClasses, isFetching: isFetchingClasses } = fetchClasses;
  const router = useRouter();
  const { isLowerRole, isMediumRole } = useRoles();
  const [initialScrollIndex, setInitialScrollIndex] = useState(0);
  const [isOpenCheckInModal, setIsOpenCheckInModal] = useState(false);
  const { showErrorToast, showSuccessToast } = useToast();
  const [permission, requestPermission] = useCameraPermissions();
  const { encrypt, decrypt } = useCrypto();
  const qrCodeLock = useRef(false);
  const [isLoadingCheckin, setIsLoadingCheckin] = useState(false);
  const { getUserByClerkUserId } = useUsers();
  const { user } = useUser();

  useEffect(() => {
    async function defineWeekDays() {
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      const tempWeekDays: WeekDay[] = [];
      for (
        let current = weekStart;
        isBefore(current, weekEnd);
        current = addDays(current, 1)
      ) {
        tempWeekDays.push({
          title: format(current, "EEEE", { locale: ptBR }),
          shortTitle: format(current, "EEE", { locale: ptBR }).substring(0, 3),
          isSelected: false,
          date: current,
          dayOfWeek: Days.find(
            (w) =>
              w.label.toLowerCase() ===
              format(current, "EEEE", { locale: ptBR }).toLowerCase()
          )?.value,
        });
      }
      setWeekDays(tempWeekDays);
      const tempInitialScrollIndex = tempWeekDays.findIndex((w) => w.date.getDate() === new Date().getDate());
      setSelectedDay(tempWeekDays[tempInitialScrollIndex]);
      setInitialScrollIndex(tempInitialScrollIndex);
      setIsLoading(false);
    }

    defineWeekDays();
  }, []);

  function handleSelectDay(day: WeekDay) {
    setSelectedDay(day);
  }

  function parseTimeToDate(time: string | null) {
    if (!time) return new Date();
    const date = parse(
      `${new Date().toISOString().split("T")[0]} ${time}`,
      "yyyy-MM-dd HH:mm:ss",
      new Date()
    );
    return date ?? new Date();
  }

  function handleClassDetails(classId: number) {
    if (!selectedDay) return;

    router.push({
      pathname: "/(logged)/(schedule)/[classId]",
      params: {
        classId,
        classDate: selectedDay.date.toISOString(),
      },
    });
  }

  async function handleCheckIn() {
    if (isLoadingCheckin) return;
    const { granted } = await requestPermission();
    if (!granted) {
      showErrorToast("Erro", "Permissão de câmera negada");
      return;
    }
    qrCodeLock.current = false;
    setIsOpenCheckInModal(true)
  }

  async function handleBarcodeScanned(data: string) {
    try {
      const decryptedData = decrypt(data);
      const result = qrCodeSchema.safeParse(decryptedData);

      if (!result.success) {
        console.error(result.error);
        qrCodeLock.current = false;
        return;
      }
      setIsOpenCheckInModal(false);
      setIsLoadingCheckin(true);
      const { gymId } = result.data;
      const classToCheckIn = await findClassToCheckIn(gymId, format(new Date(), 'HH:mm:ss'), selectedDay?.dayOfWeek ?? '');
      if (!classToCheckIn) {
        showErrorToast("Ops!", "Não existe nenhuma aula para check-in nesse horário");
        setIsLoadingCheckin(false);
      } else {
        const sp_userId = await getUserByClerkUserId(user?.id!);
        if (!sp_userId) {
          showErrorToast("Erro", "Não foi possível encontrar o usuário");
          throw new Error()
        }
        await createCheckinFn({
          classId: classToCheckIn.id,
          date: new Date().toISOString(),
          userId: sp_userId.id,
        })
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        queryClient.invalidateQueries({ queryKey: ["next-class"] });
        queryClient.invalidateQueries({ queryKey: ["checkins"] });
        queryClient.invalidateQueries({ queryKey: ["checkins-by-class-id", classToCheckIn.id] });
        queryClient.invalidateQueries({ queryKey: ["last-checkins"] });
        queryClient.invalidateQueries({ queryKey: ["last-week-checkins"] });

        setIsLoadingCheckin(false);
        showSuccessToast("Sucesso", "Check-in realizado com sucesso");
      }
    } catch (error) {
      setIsLoadingCheckin(false);
      console.error(error);
      qrCodeLock.current = false;
    }
  }

  const today = Days.find(
    (w) =>
      w.label.toLowerCase() ===
      format(new Date(), "EEEE", { locale: ptBR }).toLowerCase()
  )?.value;

  return (
    <SafeAreaView className="pl-5 pr-5 flex-1 flex flex-col items-start">
      {isMediumRole() && (
        <Button
          size="md"
          variant="solid"
          className="bg-violet-800 rounded-full w-[50px] h-[50px] absolute bottom-20 right-5 z-10"
          onPress={() => router.push("/(logged)/(schedule)/create-class")}
        >
          <ButtonIcon as={AddIcon} color="white" />
        </Button>
      )}
      {/* {isLowerRole() && (
        <Button
          size="lg"
          variant="solid"
          className="bg-violet-800 rounded-md absolute bottom-[80px] right-0 left-0 mx-10 z-10 w-fit"
          onPress={handleCheckIn}
          disabled={isLoadingCheckin}
        >
          {isLoadingCheckin && <ButtonSpinner color="white" />}
          <ButtonText className="text-white">CHECK-IN</ButtonText>
        </Button>
      )} */}
      <Box className="w-full max-h-[100px]">
        <WeekDays
          weekDays={weekDays}
          selectedDay={selectedDay ?? ({} as WeekDay)}
          handleSelectDay={handleSelectDay}
          isLoading={isLoading}
          initialScrollIndex={initialScrollIndex}
        />
      </Box>
      <ScrollView className="w-full pt-6 z-0"
        refreshControl={<RefreshControl
          refreshing={isFetchingClasses && !isLoadingClasses}
          onRefresh={refetchClasses}
        />}>
        <VStack className="gap-4 w-full mb-10 pb-20">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              isLoaded={!isLoading}
              className="w-full h-[100px] bg-neutral-800 rounded-md"
            />
          ))}
          {!isLoading &&
            !isLoadingClasses &&
            classes &&
            classes
              .filter((item) => item.day === selectedDay?.dayOfWeek)
              .map((item) => {
                const currentClass =
                  item.day === today &&
                  isAfter(new Date(), parseTimeToDate(item.start)) &&
                  isBefore(new Date(), parseTimeToDate(item.end));
                return (
                  <Pressable key={item.id} onPress={() => handleClassDetails(item.id)}>
                    <ClassCard
                      data={item}
                      currentClass={currentClass}
                      classDate={selectedDay?.date.toISOString()}
                    />
                  </Pressable>
                );
              })}
          {!isLoading &&
            !isLoadingClasses &&
            classes &&
            classes.filter((item) => item.day === selectedDay?.dayOfWeek)
              .length === 0 && (
              <Text className="text-white text-center text-md">
                Não existem aulas cadastradas para esse dia
              </Text>
            )}
        </VStack>
        <Modal visible={isOpenCheckInModal} onRequestClose={() => setIsOpenCheckInModal(false)} className="flex-1">
          <CameraView style={{ flex: 1 }} facing="back" onBarcodeScanned={({ data }) => {
            if (data && !qrCodeLock.current) {
              qrCodeLock.current = true;
              handleBarcodeScanned(data);
            }
          }} />
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
