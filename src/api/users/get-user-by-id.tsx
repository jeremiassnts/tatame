import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";

export function useGetUserById() {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return async function getUserById(userId: number) {
    try {
      const { data } = await get<any>(`/users/${userId}`);
      return data;
    } catch (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar o usuário");
      throw error;
    }
  };
}
