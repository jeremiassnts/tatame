import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { User } from "@/src/types/models";
import { useQuery } from "@tanstack/react-query";

export type StudentDetails = {
  name: string;
} & User;
export interface ListStudentsByGymIdProps {
  data: StudentDetails[];
}

export function useListStudentsByGymId() {
  const { get } = useApi();
  const { showErrorToast } = useToast();
  const { gym } = useProfileContext();

  return useQuery({
    queryKey: ["students-by-gym-id", gym?.id],
    queryFn: async () => {
      try {
        const { data } = await get<ListStudentsByGymIdProps>(
          `/users/gym/${gym?.id}/students`,
        );
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar os alunos");
        throw error;
      }
    },
  });
}
