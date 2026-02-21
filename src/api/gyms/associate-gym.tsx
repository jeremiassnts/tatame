import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useCreateNotification } from "../notifications/use-create-notification";
import { useGetGymById } from "./get-by-id";

export function associateGym() {
  const { get, post } = useApi();
  const { showErrorToast } = useToast();
  const getGymById = useGetGymById();
  const { mutateAsync: createNotification } = useCreateNotification().create();

  return useMutation({
    mutationFn: async ({
      gymId,
      userId,
    }: {
      gymId: number;
      userId: number;
    }) => {
      try {
        await post("/gyms/associate", {
          gymId,
          userId,
        });
        const gym = await getGymById(gymId);
        await createNotification({
          title: "Novo aluno associado a academia",
          content: `Verifique na lista de alunos para aprovar ou negar a associação`,
          recipients: [gym.managerId.toString()],
          channel: "push",
          status: "pending",
          viewed_by: [userId.toString()],
          sent_by: userId,
        });
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao associar a academia");
        throw error;
      }
    },
  });
}
