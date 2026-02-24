import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useCallback } from "react";

export interface NotificationRecipient {
    id?: number;
    expo_push_token?: string | null;
    expoPushToken?: string | null;
}

export function useGetNotificationRecipients() {
    const { get } = useApi();
    const { showErrorToast } = useToast();

    return useCallback(
        async (recipientIds: number[]) => {
            const validIds = recipientIds.filter(
                (id) => Number.isInteger(id) && id > 0,
            );
            const query = validIds.join(",");
            try {
                const response = await get<{
                    data: NotificationRecipient[];
                    count: number;
                }>(`/users/notification-recipients?recipientIds=${query}`);
                return response?.data ?? [];
            } catch (error) {
                showErrorToast(
                    "Erro",
                    "Ocorreu um erro ao buscar os destinatários da notificação",
                );
                throw error;
            }
        },
        [get, showErrorToast],
    );
}
