import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { mapToClassRow } from "./map-class";

export function getNextClass() {
  const { get } = useApi();
  const { showErrorToast } = useToast();
  const { user } = useProfileContext();

  return useQuery({
    queryKey: ["next-class", user?.id],
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/class/next/${user?.id}`);
        if (!data) return null;
        const raw = Array.isArray(data) ? data[0] : data;
        return raw ? mapToClassRow(raw) : null;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar a próxima aula");
        throw error;
      }
    },
  });
}
