import { Pressable, ScrollView, Text, View } from "react-native";
import { Skeleton } from "./ui/skeleton";
import { useRef } from "react";
import { Class } from "../api/fetch-classes";
import { WeekDay } from "../types/week-day";

interface WeekDaysScrollProps {
  weekDays: WeekDay[];
  selectedDay: WeekDay;
  handleSelectDay: (day: WeekDay) => void;
  isLoadingClasses: boolean;
  classes: Class[];
}

export default function WeekDaysScroll({
  weekDays,
  selectedDay,
  handleSelectDay,
  isLoadingClasses,
  classes,
}: WeekDaysScrollProps) {
  const scrollWeekRef = useRef<ScrollView>(null);

  return (
    <ScrollView horizontal ref={scrollWeekRef} className="max-h-[100px] mb-5">
      <View className="flex flex-row gap-3 pt-8">
        {weekDays.map((day) => (
          <Pressable key={day.title} onPress={() => handleSelectDay(day)}>
            <View
              className={`flex flex-col items-center justify-center bg-neutral-700 rounded-lg p-3 ${
                selectedDay?.date.getDate() === day.date.getDate()
                  ? "bg-violet-800"
                  : ""
              }`}
            >
              <Text className="text-white text-[14px] font-sora-bold uppercase">
                {day.shortTitle}
              </Text>
              <Text className="text-white text-[14px] font-sora">
                {day.date.getDate()}
              </Text>
            </View>
            {!isLoadingClasses &&
            !!classes?.filter((item) => item.dayOfWeek === day.dayOfWeek)
              .length ? (
              <View className="flex justify-center items-center bg-white rounded-full w-[18px] h-[18px] absolute top-[-5px] right-[-3px]">
                <Text className="text-neutral-800 text-[10px] font-sora-bold uppercase">
                  {
                    classes?.filter((item) => item.dayOfWeek === day?.dayOfWeek)
                      .length
                  }
                </Text>
              </View>
            ) : isLoadingClasses ? (
              <Skeleton className="rounded-full w-[18px] h-[18px] absolute top-[-5px] right-[-3px]" />
            ) : null}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
