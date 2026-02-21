import { useMutation } from "@tanstack/react-query";
import { useApi } from "../../hooks/use-api";
import { useSendNotification } from "../../hooks/use-send-notification";
import { useToast } from "../../hooks/use-toast";
import { queryClient } from "../../lib/react-query";
import { Notification } from "../../types/models";

export function useCreateNotification() {
  const { post, put } = useApi();
  const { sendNotification } = useSendNotification();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async (notification: Notification) => {
      try {
        const { data } = await post<any>("/notifications", {
          title: notification.title,
          content: notification.content,
          recipients: notification.recipients ?? [],
          channel: notification.channel ?? "push",
          sent_by: notification.sent_by,
          status: notification.status ?? "pending",
          viewed_by: notification.viewed_by ?? [],
        });
        const created = Array.isArray(data) ? data[0] : data;
        if (!created?.id) throw new Error("No notification id returned");

        try {
          await sendNotification({
            id: created.id,
            channel: "push",
            title: created.title ?? "",
            content: created.content ?? "",
            recipients: created.recipients ?? [],
          });
          await put(`/notifications/${created.id}`, {
            status: "sent",
            sent_at: new Date().toISOString(),
          });
        } catch (error) {
          console.error(error);
          showErrorToast("Erro", "Ocorreu um erro ao enviar a notificação");
          await put(`/notifications/${created.id}`, { status: "failed" });
        } finally {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
        return created;
      } catch (error) {
        throw error;
      }
    },
  });
}
