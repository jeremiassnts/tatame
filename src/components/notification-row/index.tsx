import { Notification } from "@/src/api/use-notifications";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Pressable } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { Badge, BadgeText } from "../ui/badge";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { CloseIcon, Icon } from "../ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "../ui/modal";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface NotificationRowProps {
    notification: Notification;
}

export default function NotificationRow({ notification }: NotificationRowProps) {
    const { id, title, content, sent_by_name, sent_by_image_url, sent_at, created_at, status } = notification;
    const [isOpen, setIsOpen] = useState(false);

    function getSentTime(date: string | null) {
        if (!date) return "";
        return formatDistanceToNow(new Date(date), {
            addSuffix: true,
            locale: ptBR,
        })
    }

    function getStatus(status: string | null) {
        switch (status) {
            case "pending":
                return "Pendente";
            case "sent":
                return "Enviado";
            case "failed":
                return "Falhou";
            default:
                return "";
        }
    }

    function getStatusColor(status: string | null) {
        switch (status) {
            case "pending":
                return "warning";
            case "sent":
                return "success";
            case "failed":
                return "error";
            default:
                return "error";
        }
    }

    return (
        <VStack>
            <Pressable onPress={() => setIsOpen(true)}>
                <Card key={id} className="bg-neutral-800 p-4 rounded-md">
                    <HStack className="gap-2 items-center justify-start">
                        <Avatar size="sm">
                            <AvatarFallbackText>{sent_by_name}</AvatarFallbackText>
                            <AvatarImage source={{ uri: sent_by_image_url }} />
                        </Avatar>
                        <VStack className="max-w-[65%]">
                            <Heading size="md">{title}</Heading>
                            <Text>{content?.slice(0, 50)}...</Text>
                        </VStack>
                        <VStack className="ml-auto items-end justify-between h-full">
                            <Text className="text-neutral-400 text-sm mb-auto">{getSentTime(sent_at ?? created_at)}</Text>
                            <Badge size="sm" action={getStatusColor(status)}>
                                <BadgeText>{getStatus(status)}</BadgeText>
                            </Badge>
                        </VStack>
                    </HStack>
                </Card>
            </Pressable>
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false)
                }}
                size="lg"
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">{title}</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Text>{content}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <HStack className="items-center justify-between w-full">
                            <HStack className="max-w-[60%] gap-2 items-baseline justify-start">
                                <Avatar size="xs">
                                    <AvatarFallbackText>{sent_by_name}</AvatarFallbackText>
                                    <AvatarImage source={{ uri: sent_by_image_url }} />
                                </Avatar>
                                <Text>Enviado por {sent_by_name} às {format(new Date(sent_at ?? created_at), "dd/MM/yyyy HH:mm")}</Text>
                            </HStack>
                            <Badge size="sm" action={getStatusColor(status)}>
                                <BadgeText>{getStatus(status)}</BadgeText>
                            </Badge>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    )
}