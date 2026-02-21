import { useCheckins } from "@/src/api/checkins/use-checkins";
import { DayOfWeek, Days } from "@/src/constants/date";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { addDays, eachWeekOfInterval, format, subWeeks } from "date-fns";
import { useEffect, useState } from "react";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { CheckIcon } from "../ui/icon";
import { Skeleton } from "../ui/skeleton";

interface WeekPresenceDayProps {
    day: {
        label: string;
        value: DayOfWeek;
    };
    isSelected: boolean;
}
function WeekPresenceDay({ day, isSelected }: WeekPresenceDayProps) {
    return (
        <Button
            variant={isSelected ? "solid" : "outline"}
            className={`rounded-full items-center justify-center h-10 w-10 p-1 ${isSelected ? "bg-neutral-200" : ""}`}
        >
            {isSelected && <ButtonIcon as={CheckIcon} color="black" size="lg" />}
            {!isSelected && <ButtonText size="md">{day.label[0]}</ButtonText>}
        </Button>
    );
}

export function WeekPresence() {
    const { fetchLastCheckins } = useCheckins();
    const { user } = useProfileContext();
    const { data: checkins, isLoading: isLoadingCheckins } = fetchLastCheckins(
        user?.id ?? 0,
    );
    const [checkInDays, setCheckInDays] = useState<
        { day: DayOfWeek; date: string }[]
    >([]);

    useEffect(() => {
        if (!isLoadingCheckins && checkins && checkins?.length > 0) {
            let currentDay =
                eachWeekOfInterval({
                    start: subWeeks(new Date(), 1),
                    end: new Date(),
                }).at(-1) ?? new Date();
            const tempDays = [];
            for (const day of Days) {
                if (
                    checkins.some(
                        (checkin) => checkin.date === format(currentDay, "yyyy-MM-dd"),
                    )
                ) {
                    tempDays.push({
                        day: day.value,
                        date: format(currentDay, "yyyy-MM-dd"),
                    });
                }
                currentDay = addDays(currentDay, 1);
            }
            setCheckInDays(tempDays);
        }
    }, [checkins, isLoadingCheckins]);

    const isSelected = (day: string): boolean => {
        return checkInDays.some((checkin) => checkin.day === day);
    };

    return (
        <Card size="md" variant="elevated" className="bg-neutral-800 w-full">
            <Heading size="sm" className="text-white font-medium">
                Frequência de treinos
            </Heading>
            {!isLoadingCheckins && (
                <HStack className="justify-between items-center pt-3">
                    {Days.map((day) => (
                        <WeekPresenceDay
                            key={day.value}
                            day={day}
                            isSelected={isSelected(day.value)}
                        />
                    ))}
                </HStack>
            )}
            {isLoadingCheckins && (
                <Skeleton className="w-full h-10 rounded-md mt-3" />
            )}
        </Card>
    );
}
