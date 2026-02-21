import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { mapToClassRow } from "./map-class";

export function useGetClassById() {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return async (classId: number) => {
    try {
      const { data } = await get<any>(`/class/${classId}`);
      const raw = Array.isArray(data) ? data[0] : data;
      if (!raw) return null;
      return mapToClassRow(raw);
    } catch (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar a próxima aula");
      throw error;
    }
  };
}
