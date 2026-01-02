import { CheckinRow } from "@/src/types/extendend-database.types";
import { differenceInMinutes, format, subDays } from "date-fns";
import { Flame } from "lucide-react-native";
import { useEffect, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { CheckIcon, ClockIcon, Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { GoalCard } from "./goal-card";

const CALORIES_PER_MINUTE = 8.6;

interface StudentPresenceSectionProps {
    checkins: CheckinRow[];
}

export function StudentPresenceSection({ checkins }: StudentPresenceSectionProps) {
    const [periodDays, setPeriodDays] = useState(7)
    const [totalDuration, setTotalDuration] = useState("")
    const [totalCalories, setTotalCalories] = useState(0)
    const [totalTrainings, setTotalTrainings] = useState(0)
    const [data, setData] = useState<{ label: string; value: number }[]>([])

    useEffect(() => {
        const tempData = Array.from({ length: periodDays }, (_, index) => {
            const day = subDays(new Date(), periodDays - index - 1)
            const dayCheckins = checkins.filter(checkin => checkin.date === format(day, "yyyy-MM-dd"))
            const tempTotalDuration = dayCheckins.reduce((acc, checkin) => {
                const start = new Date(`${checkin.date} ${checkin.class.start}`)
                const end = new Date(`${checkin.date} ${checkin.class.end}`)
                return acc + differenceInMinutes(end, start)
            }, 0)
            const formattedDuration = tempTotalDuration > 60
                ? `${Math.floor(tempTotalDuration / 60)}h ${tempTotalDuration % 60}m`
                : tempTotalDuration > 0 ? `${tempTotalDuration}m`
                    : ''
            return {
                label: format(day, "dd"),
                value: tempTotalDuration,
                topLabelComponent: () => (
                    <Text className="text-white text-[8px] mb-2">{formattedDuration}</Text>
                )
            }
        })
        setData(tempData)
        const aux = tempData.reduce((acc, checkin) => acc + checkin.value, 0)
        const formattedDuration = aux > 60
            ? `${Math.floor(aux / 60)}h ${aux % 60}m`
            : aux > 0 ? `${aux}m`
                : ''
        setTotalDuration(formattedDuration)
        setTotalCalories(CALORIES_PER_MINUTE * aux)
        setTotalTrainings(tempData.filter(checkin => checkin.value > 0).length)
    }, [periodDays])

    return (
        <Card className="w-full border-2 border-neutral-800 mt-4 bg-neutral-900">
            <HStack className="justify-between items-center">
                <Heading size="xs" className="text-neutral-400 mb-6">Frequência da semana</Heading>
            </HStack>
            <BarChart data={data}
                rulesType="dashed"
                barWidth={35}
                noOfSections={5}
                barBorderRadius={4}
                initialSpacing={5}
                spacing={5}
                stepHeight={30}
                rulesColor="#262626"
                showGradient
                gradientColor={'rgba(200, 100, 244,0.8)'}
                frontColor={'rgba(219, 182, 249,0.2)'}
                xAxisLabelTextStyle={{ color: 'white', fontSize: 10, opacity: 0.5 }}
                yAxisTextStyle={{ color: 'white', fontSize: 10, opacity: 0.5 }}
                xAxisColor="#262626"
                yAxisColor="#262626"
                hideYAxisText
            />
            <HStack className="w-full justify-between gap-2 mt-4">
                <GoalCard label="Tempo total" value={totalDuration} icon={<Icon as={ClockIcon} size="sm" className="text-neutral-500" />} />
                <GoalCard label="Calorias" value={totalCalories.toString()} icon={<Icon as={Flame} size="sm" className="text-neutral-500" />} />
                <GoalCard label="Treinos" value={totalTrainings.toString()} icon={<Icon as={CheckIcon} size="sm" className="text-neutral-500" />} />
            </HStack>
        </Card>
    );
}