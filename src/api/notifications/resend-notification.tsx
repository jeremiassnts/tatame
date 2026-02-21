import { useApi } from "@/src/hooks/use-api";
import { useSendNotification } from "@/src/hooks/use-send-notification";
import { useToast } from "@/src/hooks/use-toast";
import { queryClient } from "@/src/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { update } from "./update-notification";

export function resendNotification() {
  const { get } = useApi();
  const { sendNotification } = useSendNotification();
  const { showErrorToast } = useToast();
  const updateMutation = update();

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
        await updateMutation.mutateAsync({
          id: notification.id,
          status: "sent",
          sent_at: new Date().toISOString(),
        });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao enviar a notificação");
        await updateMutation.mutateAsync({
          id: notificationId,
          status: "failed",
        });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        throw error;
      }
    },
  });
}
