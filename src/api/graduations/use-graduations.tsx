import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/use-api";
import { useToast } from "../../hooks/use-toast";
import { Graduation } from "../../types/models";

export function useGraduations() {
  const { get, post, put } = useApi();
  const { showErrorToast } = useToast();

  const getGraduation = (userId: number) => {
    return useQuery({
      queryKey: ["graduation", userId],
      queryFn: async () => {
        try {
          const { data } = await get<any>(`/graduations/user/${userId}`);
          if (!data) return null;
          return Array.isArray(data) ? (data[0] ?? null) : data;
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar a graduação");
          throw error;
        }
      },
    });
  };

  const createGraduation = () => {
    return useMutation({
      mutationFn: async (
        graduation: Graduation,
      ) => {
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
  };

  const updateGraduation = () => {
    return useMutation({
      mutationFn: async (
        graduation: Partial<Graduation>,
      ) => {
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
  };

  return {
    getGraduation,
    createGraduation,
    updateGraduation,
  };
}
