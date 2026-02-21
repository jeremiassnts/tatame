import { listBirthdayUsers } from "@/src/api/users/list-birthday-users";
import { PartyPopper } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { CloseIcon, Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export function BirthdayAlert() {
    const [isOpen, setIsOpen] = useState(true);
    const { data: birthdayUsers } = listBirthdayUsers();

    if (!birthdayUsers || birthdayUsers.length === 0) return null;

    function handleClose() {
        setIsOpen(false);
    }

    return (
        <Card
            className="w-full bg-neutral-800"
            style={{ display: isOpen ? "flex" : "none" }}
        >
            <HStack className="items-center gap-4">
                <Icon as={PartyPopper} size="md" />
                <VStack className="max-w-[80%]">
                    <Text>
                        Hoje é aniversário de:{" "}
                        {birthdayUsers.map((user) => user.name).join(", ")}
                    </Text>
                    <Text>Aproveite para desejar parabéns!</Text>
                </VStack>
                <Pressable onPress={handleClose} className="ml-auto mb-auto">
                    <Icon as={CloseIcon} size="md" />
                </Pressable>
            </HStack>
        </Card>
    );
}
