import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function useListClasses() {
  const { get } = useApi();
  const { showErrorToast } = useToast();
  const { gym } = useProfileContext();

  return useQuery({
    queryKey: ["classes", gym?.id],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/class/gym/${gym?.id}`);
        if (!data) return [];
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar as aulas");
        throw error;
      }
    },
  });
}
