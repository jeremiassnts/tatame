import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function useListUnreadNotifications() {
  const { get } = useApi();
  const { showErrorToast } = useToast();
  const { user } = useProfileContext();

  return useQuery({
    queryKey: ["notifications-unread", user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) return [];
        const { data } = await get<any>(
          `/notifications/user/${user?.id}/unread`,
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
