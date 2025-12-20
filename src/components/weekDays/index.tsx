import { WeekDay } from "@/src/types/date";
import { FlatList, View } from "react-native";
import { Button, ButtonText } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface WeekDaysScrollProps {
  weekDays: WeekDay[];
  selectedDay: WeekDay;
  handleSelectDay: (day: WeekDay) => void;
  isLoading: boolean;
  initialScrollIndex: number;
}

export default function WeekDays({
  weekDays,
  selectedDay,
  handleSelectDay,
  isLoading,
  initialScrollIndex,
}: WeekDaysScrollProps) {
  return (
    <View>
      {isLoading && Array.from({ length: 7 }).map((_, index) => (
        <Skeleton
          key={index}
          className="w-[65px] h-[65px] mr-2 bg-neutral-800 rounded-md"
        />
      ))}
      {!isLoading && <FlatList data={weekDays}
        keyExtractor={item => item.title}
        initialScrollIndex={initialScrollIndex}
        showsHorizontalScrollIndicator={false}
        horizontal
        getItemLayout={(_, index) => ({
          length: 65,
          offset: 65 * index,
          index,
        })}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item: day }) => (
          <Button
            key={day.title}
            variant="solid"
            onPress={() => handleSelectDay(day)}
            className={`flex flex-col gap-0 h-[65px] items-center justify-center ${selectedDay?.date.getDate() === day.date.getDate()
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
        )}>
      </FlatList>}
    </View>
  );
}
