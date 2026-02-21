import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export function useUpdateGymLogo() {
  const { put } = useApi();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async ({ logo, gymId }: { logo: string; gymId: number }) => {
      try {
        await put<any>(`/gyms/${gymId}`, { logo });
      } catch (error) {
        showErrorToast(
          "Erro",
          "Ocorreu um erro ao atualizar a logo da academia",
        );
        throw error;
      }
    },
  });
}
