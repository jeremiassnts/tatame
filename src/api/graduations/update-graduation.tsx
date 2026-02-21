import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { Graduation } from "@/src/types/models";
import { useMutation } from "@tanstack/react-query";

export function updateGraduation() {
  const { put } = useApi();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async (graduation: Partial<Graduation>) => {
      if (!graduation.id) {
        showErrorToast("Erro", "ID da graduação é obrigatório");
        throw new Error("ID da graduação é obrigatório");
      }
      try {
        await put(`/graduations/${graduation.id}`, graduation);
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao atualizar a graduação");
        throw error;
      }
    },
  });
}
