import { Badge, BadgeText } from "../ui/badge";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { CheckCircleIcon, Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface ManagerPlanProps {
    title: string;
    description: string;
    price: number;
    features: string[];
    currency: string;
    firstMonthFree: boolean;
    isSelected: boolean;
}

export default function ManagerPlan({
    title,
    description,
    price,
    features,
    currency,
    firstMonthFree,
    isSelected,
}: ManagerPlanProps) {
    return (
        <Card
            className={`w-full rounded-md border-2 p-5 pt-12 flex flex-col gap-2 bg-neutral-800 ${isSelected ? "border-violet-500" : "border-neutral-700"}`}
        >
            <Badge size="lg" className="absolute top-0 right-0 bg-violet-500">
                <BadgeText>{title}</BadgeText>
            </Badge>
            {price === 0 && (
                <Heading size="2xl" className="text-neutral-200">
                    GRÁTIS
                </Heading>
            )}
            {firstMonthFree && (
                <Badge className="bg-violet-500 absolute top-0 left-0">
                    <BadgeText size="lg">PRIMEIRO MÊS GRÁTIS</BadgeText>
                </Badge>
            )}
            {price > 0 && (
                <HStack className="gap-2 items-end justify-start">
                    <Heading size="3xl" className="text-neutral-200">
                        {currency.toUpperCase()} ${(price / 100).toLocaleString("pt-BR")}
                    </Heading>
                    <Text className="text-neutral-400">POR MÊS</Text>
                </HStack>
            )}
            <Text className="text-neutral-400">{description}</Text>
            <VStack className="justify-start items-start gap-1">
                {features.map((feature) => (
                    <HStack key={feature} className="gap-2 items-center">
                        <Icon as={CheckCircleIcon} className="text-green-400 opacity-90" />
                        <Text key={feature} className="text-neutral-400">
                            {feature.trim()}
                        </Text>
                    </HStack>
                ))}
            </VStack>
        </Card>
    );
}
