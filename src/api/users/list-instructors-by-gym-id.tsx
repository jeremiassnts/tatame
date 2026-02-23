import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { User } from "@/src/types/models";
import { useQuery } from "@tanstack/react-query";

export interface ListInstructorsByGymIdProps {
  data: User[];
}

export function useListInstructorsByGymId(gymId: number) {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["instructors-by-gym-id", gymId],
    queryFn: async () => {
      try {
        const { data } = await get<ListInstructorsByGymIdProps>(
          `/users/gym/${gymId}/instructors`,
        );
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar os instrutores");
        throw error;
      }
    },
  });
}
