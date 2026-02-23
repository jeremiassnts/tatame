import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { Notification as NotificationRow } from "@/src/types/models";
import { useMutation } from "@tanstack/react-query";

export function useUpdateNotification() {
  const { put } = useApi();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async (
      notification: Partial<NotificationRow> & { sentAt?: string },
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
}
