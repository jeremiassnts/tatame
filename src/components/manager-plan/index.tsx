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
            className={`w-full rounded-md border p-6 flex flex-col gap-2 ${isSelected ? "border-violet-500" : "border-neutral-700"}`}
        >
            <Text className="text-neutral-200 font-normal text-neutral-200 text-lg">
                {title.toUpperCase()}
            </Text>
            {price == 0 && (
                <Heading size="2xl" className="text-neutral-200">
                    GRÁTIS
                </Heading>
            )}
            {price > 0 && (
                <VStack className="gap-2 items-start justify-center">
                    {firstMonthFree && (
                        <Badge className="bg-violet-500">
                            <BadgeText size="lg">PRIMEIRO MÊS GRÁTIS</BadgeText>
                        </Badge>
                    )}
                    <Heading size="2xl" className="text-neutral-200">
                        {currency.toUpperCase()} ${(price / 100).toLocaleString("pt-BR")}
                    </Heading>
                    <Text className="text-neutral-400">POR MÊS</Text>
                </VStack>
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
