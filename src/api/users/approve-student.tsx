import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { createNotification } from "../notifications/create-notification";

export function approveStudent() {
  const { put } = useApi();
  const { showErrorToast } = useToast();
  const { mutateAsync: createNotificationFn } = createNotification();

  return useMutation({
    mutationFn: async (userId: number) => {
      try {
        await put<any>(`/users/${userId}`, {
          approved_at: new Date().toISOString(),
          denied_at: null,
        });
        await createNotificationFn({
          title: "Parabéns! Seu cadastro foi aprovado",
          content: `Aproveite, agora você pode acessar todos os recursos da plataforma!`,
          recipients: [userId.toString()],
          channel: "push",
          status: "pending",
          viewed_by: [],
        });
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao aprovar o aluno");
        throw error;
      }
    },
  });
}
