import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export function useDeleteUser() {
  const { del } = useApi();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        const { data } = await del<any>(`/users/${userId}`);
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao deletar o usuário");
        throw error;
      }
    },
  });
}
