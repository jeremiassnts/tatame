import { Notification, useNotifications } from "../api/use-notifications";
import { queryClient } from "../lib/react-query";
import { useToast } from "./use-toast";

export function useSendNotification() {
    const { showErrorToast } = useToast();
    const { update } = useNotifications();
    const { mutateAsync: updateNotification } = update;

    async function sendNotification(notification: Notification) {
        try {
            switch (notification.channel) {
                case "push":
                    await sendPushNotification(notification);
                    break;
                default:
                    throw new Error("Canal de notificação não suportado");
            }
            await updateNotification({
                id: notification.id,
                status: "sent",
                sent_at: new Date().toISOString(),
            })
        } catch (error) {
            console.error(error);
            showErrorToast("Erro", "Ocorreu um erro ao enviar a notificação");
            await updateNotification({
                id: notification.id,
                status: "failed",
            })
        } finally {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    }

    async function sendPushNotification(notification: Notification) {

    }

    return {
        sendNotification,
    }
}