import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function listCheckins(userId: number) {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["checkins", userId],
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/checkins/user/${userId}`);
        const list = Array.isArray(data) ? data : (data ?? []);
        const today = new Date().toISOString().split("T")[0];
        return list.filter(
          (c: { date?: string }) => c?.date?.split?.("T")?.[0] === today,
        );
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
        throw error;
      }
    },
  });
}
