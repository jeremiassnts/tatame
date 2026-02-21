import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function list(userId: number) {
  const { get } = useApi();
  const { showErrorToast } = useToast();

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
}
