import { useApi } from "@/src/hooks/use-api";
import { useSendNotification } from "@/src/hooks/use-send-notification";
import { useToast } from "@/src/hooks/use-toast";
import { queryClient } from "@/src/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { updateNotification } from "./update-notification";

export function resendNotification() {
  const { get } = useApi();
  const { sendNotification } = useSendNotification();
  const { showErrorToast } = useToast();
  const { mutateAsync: updateNotificationFn } = updateNotification();

  return useMutation({
    mutationFn: async ({
      notificationId,
      userId,
    }: {
      notificationId: number;
      userId: number;
    }) => {
      try {
        const { data } = await get<any>(`/notifications/user/${userId}`);
        const list = Array.isArray(data) ? data : (data ?? []);
        const notification = list.find((n: any) => n.id === notificationId);
        if (!notification) throw new Error("Notification not found");

        await sendNotification({
          id: notification.id,
          channel: "push",
          title: notification.title ?? "",
          content: notification.content ?? "",
          recipients: notification.recipients ?? [],
        });
        await updateNotificationFn({
          id: notification.id,
          status: "sent",
          sent_at: new Date().toISOString(),
        });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao enviar a notificação");
        await updateNotificationFn({
          id: notificationId,
          status: "failed",
        });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        throw error;
      }
    },
  });
}
