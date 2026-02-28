import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useCreateNotification } from "../notifications/create-notification";

export function useApproveUser() {
  const { put } = useApi();
  const { showErrorToast } = useToast();
  const { mutateAsync: createNotificationFn } = useCreateNotification();
  const { user: manager } = useProfileContext();

  return useMutation({
    mutationFn: async (userId: number) => {
      const managerId = manager?.id;
      if (managerId == null || managerId === 0) {
        showErrorToast("Erro", "Usuário do manager não encontrado");
        throw new Error("Manager id is required");
      }
      try {
        await put<any>(`/users/${userId}/approve`, { managerId });
        await createNotificationFn({
          title: "Parabéns! Seu cadastro foi aprovado",
          content: `Aproveite, agora você pode acessar todos os recursos da plataforma!`,
          recipients: [userId.toString()],
          channel: "push",
          status: "pending",
          viewedBy: [],
        });
      } catch (error: any) {
        const msg =
          error?.response?.data?.message ??
          "Ocorreu um erro ao aprovar o aluno";
        showErrorToast("Erro", msg);
        throw error;
      }
    },
  });
}
