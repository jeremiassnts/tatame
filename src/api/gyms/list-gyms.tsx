import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function listGyms() {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["gyms"],
    queryFn: async () => {
      try {
        const { data } = await get<any>("/gyms");
        return data ?? [];
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar as academias");
        throw error;
      }
    },
  });
}
