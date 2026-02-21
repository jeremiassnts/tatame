import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { Class } from "@/src/types/models";
import { useMutation } from "@tanstack/react-query";

export function useUpdateClass() {
  const { put } = useApi();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async (payload: Partial<Class>) => {
      if (!payload.id) {
        showErrorToast("Erro", "O ID da aula é obrigatório");
        throw new Error("O ID da aula é obrigatório");
      }
      try {
        await put(`/class/${payload.id}`, payload);
        return payload;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao editar a aula");
        throw error;
      }
    },
  });
}
