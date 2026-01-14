import { ElementType } from "react";
import { Linking, Pressable } from "react-native";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";

interface InfoRowProps {
    icon: ElementType | undefined;
    label: string;
    value: string | null;
    isLink?: boolean;
    url?: string
}

export function InfoRow({ icon, label, value, isLink = false, url }: InfoRowProps) {

    async function handlePress() {
        if (!isLink || !url) {
            return
        }

        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        }
    }

    return (
        <Pressable onPress={handlePress}>
            <HStack className="gap-2 items-center">
                <Icon as={icon} size="sm" className="text-neutral-400" />
                <Text className="text-neutral-400">{label}</Text>
                <Text className="text-neutral-200 ml-auto">{value ?? "-"}</Text>
            </HStack>
        </Pressable>
    )
}