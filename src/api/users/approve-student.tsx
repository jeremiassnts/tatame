import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useCreateNotification } from "../notifications/create-notification";

export function useApproveStudent() {
  const { put } = useApi();
  const { showErrorToast } = useToast();
  const { mutateAsync: createNotificationFn } = useCreateNotification();

  return useMutation({
    mutationFn: async (userId: number) => {
      try {
        await put<any>(`/users/${userId}`, {
          approvedAt: new Date().toISOString(),
          deniedAt: null,
        });
        await createNotificationFn({
          title: "Parabéns! Seu cadastro foi aprovado",
          content: `Aproveite, agora você pode acessar todos os recursos da plataforma!`,
          recipients: [userId.toString()],
          channel: "push",
          status: "pending",
          viewedBy: [],
        });
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao aprovar o aluno");
        throw error;
      }
    },
  });
}
