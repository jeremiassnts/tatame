import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";

export async function getGymById(gymId: number) {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  try {
    const { data } = await get<any>(`/gyms/${gymId}`);
    return data;
  } catch (error) {
    showErrorToast("Erro", "Ocorreu um erro ao buscar a academia");
    throw error;
  }
}
