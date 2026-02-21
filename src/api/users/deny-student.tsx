import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useCreateNotification } from "../notifications/use-create-notification";

export function denyStudent() {
  const { put } = useApi();
  const { showErrorToast } = useToast();
  const { mutateAsync: createNotification } = useCreateNotification().create();

  return useMutation({
    mutationFn: async (userId: number) => {
      try {
        await put<any>(`/users/${userId}`, {
          approved_at: null,
          denied_at: new Date().toISOString(),
        });
        await createNotification({
          title: "Que pena! Seu cadastro foi negado",
          content: `Por favor, contate o suporte para mais informações`,
          recipients: [userId.toString()],
          channel: "push",
          status: "pending",
          viewed_by: [],
        });
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao negar o aluno");
        throw error;
      }
    },
  });
}
