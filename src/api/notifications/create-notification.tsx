import { useMutation } from "@tanstack/react-query";
import { useApi } from "../../hooks/use-api";
import { useSendNotification } from "../../hooks/use-send-notification";
import { useToast } from "../../hooks/use-toast";
import { queryClient } from "../../lib/react-query";

export interface CreateNotificationProps {
  title: string;
  content: string;
  recipients: string[];
  channel: string;
  sentBy?: number;
  status: string;
  viewedBy: string[];
}

export function useCreateNotification() {
  const { post, put } = useApi();
  const { sendNotification } = useSendNotification();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async (notification: CreateNotificationProps) => {
      try {
        const { data } = await post<any>("/notifications", {
          title: notification.title,
          content: notification.content,
          recipients: notification.recipients ?? [],
          channel: notification.channel ?? "push",
          sentBy: notification.sentBy,
          status: notification.status ?? "pending",
          viewedBy: notification.viewedBy ?? [],
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
            sentAt: new Date().toISOString(),
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
