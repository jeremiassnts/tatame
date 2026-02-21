import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";

export function useGetGymById() {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return async (gymId: number) => {
    try {
      const { data } = await get<any>(`/gyms/${gymId}`);
      return data;
    } catch (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar a academia");
      throw error;
    }
  };
}
