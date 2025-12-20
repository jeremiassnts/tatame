import { useClass } from "@/src/api/use-class";
import { useRoles } from "@/src/api/use-roles";
import { ClassCard } from "@/src/components/class-card";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonIcon } from "@/src/components/ui/button";
import { AddIcon } from "@/src/components/ui/icon";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import WeekDays from "@/src/components/weekDays";
import { Days } from "@/src/constants/date";
import { WeekDay } from "@/src/types/date";
import { addDays, endOfWeek, format, isAfter, isBefore, parse, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Schedule() {
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<WeekDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchClasses } = useClass();
  const { data: classes, isLoading: isLoadingClasses, refetch: refetchClasses, isFetching: isFetchingClasses } = fetchClasses;
  const router = useRouter();
  const { getRole } = useRoles();
  const { data: role } = getRole;

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
      setSelectedDay(
        tempWeekDays.find((w) => w.date.getDate() === new Date().getDate()) || null
      );
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

  const today = Days.find(
    (w) =>
      w.label.toLowerCase() ===
      format(new Date(), "EEEE", { locale: ptBR }).toLowerCase()
  )?.value;

  return (
    <SafeAreaView className="pl-5 pr-5 flex-1 flex flex-col items-start">
      {role === "MANAGER" && (
        <Button
          size="md"
          variant="solid"
          className="bg-violet-800 rounded-full w-[50px] h-[50px] absolute bottom-20 right-5 z-10"
          onPress={() => router.push("/(logged)/(schedule)/create-class")}
        >
          <ButtonIcon as={AddIcon} color="white" />
        </Button>
      )}
      <Box className="w-full max-h-[100px]">
        <WeekDays
          weekDays={weekDays}
          selectedDay={selectedDay ?? ({} as WeekDay)}
          handleSelectDay={handleSelectDay}
          isLoading={isLoading}
        />
      </Box>
      <ScrollView className="w-full pt-6 z-0"
        refreshControl={<RefreshControl
          refreshing={isFetchingClasses && !isLoadingClasses}
          onRefresh={refetchClasses}
        />}>
        <VStack className="gap-4 w-full mb-10">
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
                  <Pressable key={item.id} onPress={() => router.push(`/(logged)/(schedule)/${item.id}`)}>
                    <ClassCard
                      data={item}
                      currentClass={currentClass}
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
      </ScrollView>
    </SafeAreaView>
  );
}
