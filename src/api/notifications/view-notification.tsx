import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export function view() {
  const { post } = useApi();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, userId }: { id: number; userId: string }) => {
      try {
        await post(`/notifications/${id}/view`, { userId });
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao visualizar a notificação");
        throw error;
      }
    },
  });
}
