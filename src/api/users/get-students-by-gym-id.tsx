import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function getStudentsByGymId(gymId: number) {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["students-by-gym-id", gymId],
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/users/gym/${gymId}/students`);
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar os alunos");
        throw error;
      }
    },
  });
}
