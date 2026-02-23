import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export interface CreateGraduationProps {
  userId: number;
  belt: string;
  degree: number;
  modality: string;
}

export function useCreateGraduation() {
  const { post } = useApi();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async (graduation: CreateGraduationProps) => {
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
