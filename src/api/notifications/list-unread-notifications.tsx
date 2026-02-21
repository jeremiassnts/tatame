import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function listUnread(userId: number) {
  const { get } = useApi();
  const { showErrorToast } = useToast();

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
}
