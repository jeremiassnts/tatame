import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { mapToClassRow } from "./map-class";

export function listClasses(gymId: number) {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["classes", gymId],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/class/gym/${gymId}`);
        const list = Array.isArray(data) ? data : (data ?? []);
        return list.map(mapToClassRow);
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar as aulas");
        throw error;
      }
    },
  });
}
