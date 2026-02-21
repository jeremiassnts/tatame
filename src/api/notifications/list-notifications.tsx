import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function useListNotifications() {
  const { get } = useApi();
  const { showErrorToast } = useToast();
  const { user } = useProfileContext();

  return useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/notifications/user/${user?.id}`);
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar as notificações");
        throw error;
      }
    },
  });
}
