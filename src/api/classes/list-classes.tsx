import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { mapToClassRow } from "./map-class";

export function listClasses() {
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
        const list = Array.isArray(data) ? data : (data ?? []);
        return list.map(mapToClassRow);
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar as aulas");
        throw error;
      }
    },
  });
}
