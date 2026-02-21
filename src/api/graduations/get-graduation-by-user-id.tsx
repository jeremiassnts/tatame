import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export async function getGraduationByUserId(userId: number) {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["graduation", userId],
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/graduations/user/${userId}`);
        if (!data) return null;
        return Array.isArray(data) ? (data[0] ?? null) : data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar a graduação");
        throw error;
      }
    },
  });
}
