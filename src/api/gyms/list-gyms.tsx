import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { Gym } from "@/src/types/models";
import { useQuery } from "@tanstack/react-query";

export interface ListGymsProps {
  data: Gym[];
}

export function useListGyms() {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["gyms"],
    queryFn: async () => {
      try {
        const { data } = await get<ListGymsProps>("/gyms");
        return data ?? [];
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar as academias");
        throw error;
      }
    },
  });
}
