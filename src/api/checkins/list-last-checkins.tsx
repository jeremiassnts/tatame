import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function listLastCheckins(userId: number) {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["last-checkins", userId],
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/checkins/user/${userId}/last`);
        return Array.isArray(data) ? data : (data ?? []);
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
        throw error;
      }
    },
  });
}
