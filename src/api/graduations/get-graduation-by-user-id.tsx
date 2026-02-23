import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function useGetGraduationByUserId() {
  const { get } = useApi();
  const { showErrorToast } = useToast();
  const { user } = useProfileContext();

  return useQuery({
    queryKey: ["graduation", user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) return null;
        const { data } = await get<any>(`/graduations/user/${user?.id}`);
        if (!data) return null;
        return Array.isArray(data) ? (data[0] ?? null) : data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar a graduação");
        throw error;
      }
    },
  });
}
