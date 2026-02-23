import { NotificationDetails } from "@/src/api/notifications/list-notifications";
import { queryClient } from "@/src/lib/react-query";
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
    notification: NotificationDetails;
    onResend: ({ notificationId }: { notificationId: number }) => Promise<void>;
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
        sentByName,
        sentByImageUrl,
        sentAt,
        createdAt,
        status,
        sentBy,
    } = notification;
    const [viewed, setViewed] = useState(
        notification.viewedBy?.includes(currentUserId.toString()) ||
        notification.sentBy === currentUserId,
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
        onResend({ notificationId: id });
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
                            {sentBy && (
                                <Avatar size="sm">
                                    <AvatarFallbackText>{sentByName}</AvatarFallbackText>
                                    <AvatarImage source={{ uri: sentByImageUrl }} />
                                </Avatar>
                            )}
                            <VStack className="max-w-[90%]">
                                <Heading size="md">{title}</Heading>
                                <Text className="flex-wrap">{content?.slice(0, 50)}...</Text>
                            </VStack>
                        </HStack>
                        <HStack className="items-center justify-between">
                            <Text className="text-neutral-400 text-sm">
                                {getSentTime(sentAt?.toISOString() ?? createdAt.toISOString())}
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
                                    {notification.sentBy && (
                                        <Avatar size="xs">
                                            <AvatarFallbackText>{sentByName}</AvatarFallbackText>
                                            <AvatarImage source={{ uri: sentByImageUrl }} />
                                        </Avatar>
                                    )}
                                    {notification.sentBy && (
                                        <Text>
                                            Enviado por {sentByName} às{" "}
                                            {formatInTimeZone(
                                                new Date(
                                                    sentAt?.toISOString() ?? createdAt.toISOString(),
                                                ),
                                                "America/Sao_Paulo",
                                                "dd/MM/yyyy HH:mm",
                                            )}
                                        </Text>
                                    )}
                                    {!notification.sentBy && (
                                        <Text>
                                            Enviado às{" "}
                                            {formatInTimeZone(
                                                new Date(
                                                    sentAt?.toISOString() ?? createdAt.toISOString(),
                                                ),
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
