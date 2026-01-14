import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";

interface GoalCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

export function GoalCard({ label, value, icon }: GoalCardProps) {
    return (
        <Card className="bg-neutral-800">
            <HStack className="items-center gap-1 mb-1">
                {icon}
                <Text className="text-sm text-neutral-500">{label}</Text>
            </HStack>
            <Heading size="2xl" className="text-center">{value}</Heading>
        </Card>
    )
}