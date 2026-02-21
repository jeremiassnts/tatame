import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { Graduation } from "@/src/types/models";
import { useMutation } from "@tanstack/react-query";

export function useCreateGraduation() {
  const { post } = useApi();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async (graduation: Graduation) => {
      try {
        const { data } = await post<any>("/graduations", {
          userId: graduation.userId,
          belt: graduation.belt,
          degree: graduation.degree,
          modality: graduation.modality,
        });
        return Array.isArray(data) ? data[0] : data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao criar a graduação");
        throw error;
      }
    },
  });
}
