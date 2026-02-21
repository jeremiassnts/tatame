import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export function useDeleteClass() {
  const { del } = useApi();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async (classId: number) => {
      try {
        await del(`/class/${classId}`);
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao deletar a aula");
        throw error;
      }
    },
  });
}
