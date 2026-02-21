import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/use-api";
import { useSendNotification } from "../../hooks/use-send-notification";
import { useToast } from "../../hooks/use-toast";
import { queryClient } from "../../lib/react-query";
import { Notification as NotificationRow } from "../../types/models";

export type Notification = NotificationRow & {
  sent_by_name: string;
  sent_by_image_url: string;
};

export function useNotifications() {
  const { get, put, post } = useApi();
  const { sendNotification } = useSendNotification();
  const { showErrorToast } = useToast();

  const list = (userId: number) => {
    return useQuery({
      queryKey: ["notifications", userId],
      queryFn: async () => {
        try {
          const { data } = await get<any>(`/notifications/user/${userId}`);
          return data;
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar as notificações");
          throw error;
        }
      },
    });
  };

  const listUnread = (userId: number) => {
    return useQuery({
      queryKey: ["notifications-unread", userId],
      queryFn: async () => {
        try {
          const { data } = await get<any>(
            `/notifications/user/${userId}/unread`,
          );
          return data;
        } catch (error) {
          showErrorToast(
            "Erro",
            "Ocorreu um erro ao buscar as notificações não lidas",
          );
          throw error;
        }
      },
    });
  };
  const update = () => {
    return useMutation({
      mutationFn: async (
        notification: Partial<NotificationRow> & { sent_at?: string },
      ) => {
        if (!notification.id) throw new Error("Notification id required");
        try {
          const { data } = await put<any>(
            `/notifications/${notification.id}`,
            notification,
          );
          return data;
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao atualizar a notificação");
          throw error;
        }
      },
    });
  };

  const resend = () => {
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
          await update().mutateAsync({
            id: notification.id,
            status: "sent",
            sent_at: new Date().toISOString(),
          });
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao enviar a notificação");
          await update().mutateAsync({
            id: notificationId,
            status: "failed",
          });
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          throw error;
        }
      },
    });
  };
  const view = () => {
    return useMutation({
      mutationFn: async ({ id, userId }: { id: number; userId: string }) => {
        try {
          await post(`/notifications/${id}/view`, { userId });
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao visualizar a notificação");
          throw error;
        }
      },
    });
  };

  return {
    list,
    update,
    resend,
    listUnread,
    view,
  };
}
