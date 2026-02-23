import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useCreateNotification } from "../notifications/create-notification";

export function useDenyStudent() {
  const { put } = useApi();
  const { showErrorToast } = useToast();
  const { mutateAsync: createNotificationFn } = useCreateNotification();

  return useMutation({
    mutationFn: async (userId: number) => {
      try {
        await put<any>(`/users/${userId}`, {
          approvedAt: null,
          deniedAt: new Date().toISOString(),
        });
        await createNotificationFn({
          title: "Que pena! Seu cadastro foi negado",
          content: `Por favor, contate o suporte para mais informações`,
          recipients: [userId.toString()],
          channel: "push",
          status: "pending",
          viewedBy: [],
        });
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao negar o aluno");
        throw error;
      }
    },
  });
}
