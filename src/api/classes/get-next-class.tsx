import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { mapToClassRow } from "./map-class";

export function getNextClass(userId: number) {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["next-class", userId],
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/class/next/${userId}`);
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
