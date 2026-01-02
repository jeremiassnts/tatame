import { ElementType } from "react";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";

interface InfoRowProps {
    icon: ElementType | undefined;
    label: string;
    value: string | null;
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
    return (
        <HStack className="gap-2 items-center">
            <Icon as={icon} size="sm" className="text-neutral-400" />
            <Text className="text-neutral-400">{label}</Text>
            <Text className="text-neutral-200 ml-auto">{value ?? "-"}</Text>
        </HStack>
    )
}