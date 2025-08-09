import Icon from "@react-native-vector-icons/feather";
import { useQuery } from "@tanstack/react-query";
import { addDays, format, isBefore, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { Class, fetchClasses } from "~/src/api/fetch-classes";
import { Button } from "~/src/components/ui/button";
import { Skeleton } from "~/src/components/ui/skeleton";
import { useAuthentication } from "~/src/providers/authentication-provider";
import { weekDays as weekDaysConstants } from "~/src/constants/week-days";
import ClassCard from "~/src/components/class-card";
import WeekDaysScroll from "~/src/components/week-days-scroll";
import { WeekDay } from "~/src/types/week-day";

/**
 * @title Schedule index
 * @description Schedule main page, showing the classes of the selected day
 */
export default function Index() {
  const router = useRouter();
  const { getSession } = useAuthentication();
  const [isLoading, setIsLoading] = useState(true);
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<WeekDay | null>(null);
  const scrollWeekRef = useRef<ScrollView>(null);
  const { data: classes, isLoading: isLoadingClasses } = useQuery<Class[]>({
    queryKey: ["classes"],
    queryFn: async () => {
      const { accessToken } = await getSession();
      return fetchClasses(accessToken ?? "");
    },
  });

  useEffect(() => {
    async function defineWeekDays() {
      const today = new Date();
      const tempWeekDays: WeekDay[] = [];
      for (
        let current = subDays(today, 3);
        isBefore(current, addDays(today, 4));
        current = addDays(current, 1)
      ) {
        tempWeekDays.push({
          title: format(current, "EEEE", { locale: ptBR }),
          shortTitle: format(current, "EEE", { locale: ptBR }).substring(0, 3),
          isSelected: false,
          date: current,
          dayOfWeek: weekDaysConstants.find(
            (w) =>
              w.label.toLowerCase() ===
              format(current, "EEEE", { locale: ptBR }).toLowerCase()
          )?.value,
        });
      }
      setWeekDays(tempWeekDays);
      setSelectedDay(
        tempWeekDays.find((w) => w.date.getDate() === today.getDate()) || null
      );
      scrollWeekRef.current?.scrollTo({
        x: 100,
        animated: false,
      });
    }

    Promise.all([defineWeekDays()]).then(() => {
      setIsLoading(false);
    });
  }, []);

  function handleSelectDay(day: WeekDay) {
    setSelectedDay(day);
  }
  function handleNewClass() {
    router.push("/(dashboard)/(schedule)/new-class");
  }

  return (
    <SafeAreaView className="flex flex-1 bg-neutral-900 flex-col items-start justify-start pb-2">
      {/* Button to create a new class */}
      <Button
        onPress={handleNewClass}
        className="bg-violet-800 rounded-full absolute bottom-5 right-5 z-10"
      >
        <Icon name="plus" size={20} color="#ffffff" />
      </Button>
      {/* Week days horizontal scroll */}
      {isLoading ? (
        <Skeleton className="w-full h-[100px] mb-5" />
      ) : (
        <WeekDaysScroll
          weekDays={weekDays}
          selectedDay={selectedDay ?? ({} as WeekDay)}
          handleSelectDay={handleSelectDay}
          isLoadingClasses={isLoadingClasses}
          classes={classes ?? []}
        />
      )}

      {/* Skeleton to show while loading classes */}
      {(isLoading || isLoadingClasses) && (
        <View className="flex flex-col gap-3 w-full">
          <Skeleton className="w-full h-[100px]" />
          <Skeleton className="w-full h-[100px]" />
          <Skeleton className="w-full h-[100px]" />
        </View>
      )}

      {/* Classes list filtered by selected day */}
      {!isLoading && !isLoadingClasses && classes && classes.length > 0 && (
        <ScrollView>
          <View className="w-full flex flex-col gap-2">
            {classes
              .filter((item) => item.dayOfWeek === selectedDay?.dayOfWeek)
              .map((item) => (
                <ClassCard
                  key={item.id}
                  {...item}
                  day={selectedDay?.date}
                  instructorId={item.userId}
                  weekDay={item.dayOfWeek}
                />
              ))}
            {classes.filter((item) => item.dayOfWeek === selectedDay?.dayOfWeek)
              .length === 0 && (
              <View className="w-full">
                <Text className="font-sora text-[14px] text-neutral-500 text-center">
                  Não existem aulas cadastradas para esse dia
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
