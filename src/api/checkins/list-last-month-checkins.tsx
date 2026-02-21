import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { Checkin } from "@/src/types/models";
import { useQuery } from "@tanstack/react-query";

export function listLastMonthCheckins(userId: number) {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["last-month-checkins", userId],
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/checkins/user/${userId}/last-month`);
        return (Array.isArray(data) ? data : (data ?? [])) as Checkin[];
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
        throw error;
      }
    },
  });
}
