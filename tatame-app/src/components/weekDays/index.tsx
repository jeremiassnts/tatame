import { ScrollView } from "react-native";
import { HStack } from "../ui/hstack";
import { Button, ButtonText } from "../ui/button";
import { WeekDay } from "@/src/types/date";
import { Skeleton } from "../ui/skeleton";

interface WeekDaysScrollProps {
  weekDays: WeekDay[];
  selectedDay: WeekDay;
  handleSelectDay: (day: WeekDay) => void;
  isLoading: boolean;
}

export default function WeekDays({
  weekDays,
  selectedDay,
  handleSelectDay,
  isLoading,
}: WeekDaysScrollProps) {
  return (
    <ScrollView horizontal>
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton
          isLoaded={!isLoading}
          key={index}
          className="w-[65px] h-[65px] mr-2 bg-neutral-800 rounded-md"
        />
      ))}
      {!isLoading && (
        <HStack className="gap-2 items-center justify-between">
          {weekDays.map((day) => (
            <Button
              key={day.title}
              variant="solid"
              onPress={() => handleSelectDay(day)}
              className={`flex flex-col gap-0 h-[65px] items-center justify-center ${
                selectedDay?.date.getDate() === day.date.getDate()
                  ? "bg-violet-800"
                  : "bg-neutral-800"
              }`}
            >
              <ButtonText className="capitalize text-white text-sm">
                {day.shortTitle}
              </ButtonText>
              <ButtonText className="text-white text-xl font-black">
                {day.date.getDate() < 10 ? "0" : ""}
                {day.date.getDate()}
              </ButtonText>
            </Button>
          ))}
        </HStack>
      )}
    </ScrollView>
  );
}
