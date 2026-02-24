import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useCallback } from "react";
import { Platform } from "react-native";
import { useGetNotificationRecipients } from "../api/users/get-notification-recipients";
import { useUpdateUser } from "../api/users/update-user";
import { useProfileContext } from "./use-profile-context";
import { useToast } from "./use-toast";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface SendNotificationProps {
    id: number;
    channel: string;
    title: string;
    content: string;
    recipients: string[];
}

export interface Notification {
    id: number;
    channel: string;
    title: string;
    content: string;
    recipients: string[];
    status: string;
    sentAt: string;
}

export function useSendNotification() {
    const { showErrorToast } = useToast();
    const getNotificationRecipients = useGetNotificationRecipients();
    const { mutateAsync: updateUserFn } = useUpdateUser();
    const { user } = useProfileContext();

    async function sendNotification(notification: SendNotificationProps) {
        try {
            switch (notification.channel) {
                case "push":
                    await sendPushNotification(notification);
                    break;
                default:
                    throw new Error("Canal de notificação não suportado");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function sendPushNotification(notification: SendNotificationProps) {
        const data = await getNotificationRecipients(
            notification.recipients.map((recipient) => parseInt(recipient)),
        );
        const expoPushTokens = data.map((user) => user.expoPushToken);
        const messages = expoPushTokens
            .filter((token) => !!token)
            .map((token) => ({
                to: token,
                sound: "default",
                title: notification.title,
                body: notification.content,
                data: {
                    notificationId: notification.id,
                },
            }));
        await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messages),
        });
    }

    async function registerForPushNotificationsAsync() {
        try {
            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#FF231F7C",
                });
            }

            if (Device.isDevice) {
                const { status: existingStatus } =
                    await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== "granted") {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== "granted") {
                    throw new Error(
                        "Permission not granted to get push token for push notification!",
                    );
                }
                const projectId =
                    Constants?.expoConfig?.extra?.eas?.projectId ??
                    Constants?.easConfig?.projectId;
                if (!projectId) {
                    throw new Error("Project ID not found");
                }
                try {
                    const pushTokenString = (
                        await Notifications.getExpoPushTokenAsync({
                            projectId,
                        })
                    ).data;
                    return pushTokenString;
                } catch (e: unknown) {
                    throw new Error(`${e}`);
                }
            } else {
                throw new Error("Must use physical device for push notifications");
            }
        } catch (error) {
            console.error(error);
            showErrorToast("Erro", "Ocorreu um erro ao registrar para notificações");
        }
    }

    const initializePushNotifications = useCallback(() => {
        registerForPushNotificationsAsync()
            .then(async (token) => {
                await updateUserFn({
                    id: user?.id ?? 0,
                    expoPushToken: token ?? "",
                });
            })
            .catch((error: any) => {
                console.error(error);
            });

        const notificationListener = Notifications.addNotificationReceivedListener(
            (notification) => { },
        );

        const responseListener =
            Notifications.addNotificationResponseReceivedListener((response) => { });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, [user?.id]);

    return {
        sendNotification,
        initializePushNotifications,
    };
}
