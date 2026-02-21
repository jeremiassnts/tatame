import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export function update() {
  const { put } = useApi();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await put<any>(`/users/${data.id}`, data);
        return response.data;
      } catch (error) {
        console.error(error);
        showErrorToast("Erro", "Ocorreu um erro ao atualizar o usuário");
        throw error;
      }
    },
  });
}
