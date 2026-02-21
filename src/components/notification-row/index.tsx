import { queryClient } from "@/src/lib/react-query";
import { Notification } from "@/src/types/models";
import { formatInTimeZone } from "date-fns-tz";
import { SendIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { Badge, BadgeText } from "../ui/badge";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { CloseIcon, Icon } from "../ui/icon";
import {
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "../ui/modal";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface NotificationRowProps {
    notification: Notification;
    onResend: (id: number) => void;
    isPendingResending: boolean;
    currentUserId: number;
    onView: (props: { id: number; userId: string }) => Promise<void>;
    isHigherRole: boolean;
}

export default function NotificationRow({
    notification,
    onResend,
    isPendingResending,
    currentUserId,
    onView,
    isHigherRole,
}: NotificationRowProps) {
    const {
        id,
        title,
        content,
        sent_by_name,
        sent_by_image_url,
        sent_at,
        created_at,
        status,
        sent_by,
    } = notification;
    const [viewed, setViewed] = useState(
        notification.viewed_by?.includes(currentUserId.toString()) ||
        notification.sent_by === currentUserId,
    );
    const [isOpen, setIsOpen] = useState(false);

    function getSentTime(date: string | null) {
        if (!date) return "";
        return formatInTimeZone(
            new Date(date),
            "America/Sao_Paulo",
            "dd/MM/yyyy HH:mm",
        );
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

    function handleResendNotification() {
        onResend(id);
    }

    async function handleViewNotification() {
        setIsOpen(true);
        if (!viewed) {
            await onView({ id, userId: currentUserId.toString() });
            queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
            setViewed(true);
        }
    }

    return (
        <VStack>
            <Pressable onPress={handleViewNotification}>
                <Card
                    key={id}
                    className={`bg-neutral-800 p-4 rounded-md border-[1px] ${viewed ? "border-neutral-800 opacity-60" : "border-neutral-600"}`}
                >
                    <VStack className="gap-2">
                        <HStack className="gap-2 items-center justify-start">
                            {sent_by && (
                                <Avatar size="sm">
                                    <AvatarFallbackText>{sent_by_name}</AvatarFallbackText>
                                    <AvatarImage source={{ uri: sent_by_image_url }} />
                                </Avatar>
                            )}
                            <VStack className="max-w-[90%]">
                                <Heading size="md">{title}</Heading>
                                <Text className="flex-wrap">{content?.slice(0, 50)}...</Text>
                            </VStack>
                        </HStack>
                        <HStack className="items-center justify-between">
                            <Text className="text-neutral-400 text-sm">
                                {getSentTime(sent_at ?? created_at)}
                            </Text>
                            {isHigherRole && (
                                <Badge size="sm" action={getStatusColor(status)}>
                                    <BadgeText>{getStatus(status)}</BadgeText>
                                </Badge>
                            )}
                        </HStack>
                    </VStack>
                </Card>
            </Pressable>
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
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
                        <VStack>
                            {isHigherRole && (
                                <Button
                                    disabled={isPendingResending}
                                    className="bg-violet-800 mb-4"
                                    onPress={handleResendNotification}
                                >
                                    <ButtonIcon as={SendIcon} size="sm" color="white" />
                                    <ButtonText className="text-white">Reenviar</ButtonText>
                                </Button>
                            )}
                            <HStack className="items-center justify-between w-full">
                                <HStack className="max-w-[60%] gap-2 items-baseline justify-start mr-auto">
                                    {notification.sent_by && (
                                        <Avatar size="xs">
                                            <AvatarFallbackText>{sent_by_name}</AvatarFallbackText>
                                            <AvatarImage source={{ uri: sent_by_image_url }} />
                                        </Avatar>
                                    )}
                                    {notification.sent_by && (
                                        <Text>
                                            Enviado por {sent_by_name} às{" "}
                                            {formatInTimeZone(
                                                new Date(sent_at ?? created_at),
                                                "America/Sao_Paulo",
                                                "dd/MM/yyyy HH:mm",
                                            )}
                                        </Text>
                                    )}
                                    {!notification.sent_by && (
                                        <Text>
                                            Enviado às{" "}
                                            {formatInTimeZone(
                                                new Date(sent_at ?? created_at),
                                                "America/Sao_Paulo",
                                                "dd/MM/yyyy HH:mm",
                                            )}
                                        </Text>
                                    )}
                                </HStack>
                                {isHigherRole && (
                                    <Badge size="sm" action={getStatusColor(status)}>
                                        <BadgeText>{getStatus(status)}</BadgeText>
                                    </Badge>
                                )}
                            </HStack>
                        </VStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
}
