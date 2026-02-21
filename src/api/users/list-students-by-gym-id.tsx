import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function listStudentsByGymId() {
  const { get } = useApi();
  const { showErrorToast } = useToast();
  const { gym } = useProfileContext();

  return useQuery({
    queryKey: ["students-by-gym-id", gym?.id],
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/users/gym/${gym?.id}/students`);
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar os alunos");
        throw error;
      }
    },
  });
}
