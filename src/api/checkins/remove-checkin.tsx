import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export function useRemoveCheckin() {
  const { del } = useApi();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async (checkinId: number) => {
      try {
        const { data } = await del<any>(`/checkins/${checkinId}`);
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao apagar o checkin");
        throw error;
      }
    },
  });
}
