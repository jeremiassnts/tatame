import { Days } from "@/src/constants/date";
import { CheckinRow } from "@/src/types/extendend-database.types";
import { addDays, differenceInMinutes, endOfWeek, format, isBefore, startOfWeek } from "date-fns";
import { Flame } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { CheckIcon, ClockIcon, Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { GoalCard } from "./goal-card";

const CALORIES_PER_MINUTE = 8.6;

interface StudentPresenceSectionProps {
    checkins: CheckinRow[];
}
export interface StudentPresenceSectionData {
    date: number
    weekDay: string
    isPresent: boolean
    duration: number
}

export function StudentPresenceSection({ checkins }: StudentPresenceSectionProps) {
    const [totalDuration, setTotalDuration] = useState("")
    const [totalCalories, setTotalCalories] = useState(0)
    const [totalTrainings, setTotalTrainings] = useState(0)
    const [data, setData] = useState<StudentPresenceSectionData[]>([])

    useEffect(() => {
        const weekStart = startOfWeek(new Date());
        const weekEnd = endOfWeek(new Date());
        const tempWeekDays: StudentPresenceSectionData[] = [];
        for (
            let current = weekStart;
            isBefore(current, weekEnd);
            current = addDays(current, 1)
        ) {
            const dayCheckins = checkins.filter(checkin => checkin.date === format(current, "yyyy-MM-dd"))
            const tempTotalDuration = dayCheckins.reduce((acc, checkin) => {
                const start = new Date(`${checkin.date} ${checkin.class.start}`)
                const end = new Date(`${checkin.date} ${checkin.class.end}`)
                return acc + differenceInMinutes(end, start)
            }, 0)
            const weekDay = Days.find(d => d.value === format(current, "EEEE").toUpperCase())?.label ?? ""
            tempWeekDays.push({
                weekDay: weekDay,
                date: current.getDate(),
                isPresent: tempTotalDuration > 0,
                duration: tempTotalDuration
            });
        }
        setData(tempWeekDays)
        const aux = tempWeekDays.reduce((acc, checkin) => acc + checkin.duration, 0)
        const formattedDuration = aux > 60
            ? `${Math.floor(aux / 60)}h ${aux % 60}m`
            : aux > 0 ? `${aux}m`
                : '0'
        setTotalDuration(formattedDuration)
        setTotalCalories(CALORIES_PER_MINUTE * aux)
        setTotalTrainings(tempWeekDays.filter(checkin => checkin.duration > 0).length)
    }, [])

    return (
        <Card className="w-full border-2 border-neutral-800 mt-4 bg-neutral-900">
            <HStack className="justify-between items-center mb-6">
                <Heading size="xs" className="text-neutral-400">Frequência</Heading>
            </HStack>
            <HStack className="justify-between items-center">
                {data.map(day => (
                    <VStack key={day.date} className="gap-2">
                        <Text className="text-white text-sm text-center font-bold">{day.weekDay.slice(0, 3)}</Text>
                        <Box className={`rounded-full border-[1px] border-neutral-200 w-[40px] h-[40px] items-center justify-center ${day.isPresent ? "bg-neutral-200" : ""}`}>
                            <Text className={`text-white text-md text-center font-bold ${day.isPresent ? "text-neutral-800" : "text-neutral-200"}`}>{day.date}</Text>
                        </Box>
                    </VStack>
                ))}
            </HStack>
            <HStack className="w-full justify-between gap-2 mt-4">
                <GoalCard label="Tempo total" value={totalDuration} icon={<Icon as={ClockIcon} size="sm" className="text-neutral-500" />} />
                <GoalCard label="Calorias" value={totalCalories.toString()} icon={<Icon as={Flame} size="sm" className="text-neutral-500" />} />
                <GoalCard label="Treinos" value={totalTrainings.toString()} icon={<Icon as={CheckIcon} size="sm" className="text-neutral-500" />} />
            </HStack>
        </Card>
    );
}