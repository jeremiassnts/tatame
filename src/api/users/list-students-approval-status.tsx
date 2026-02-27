import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ListStudentsApprovalStatusProps {
  data: { isApproved: boolean };
}

export function useListStudentsApprovalStatus() {
  const { get } = useApi();
  const { showErrorToast } = useToast();
  const { user } = useProfileContext();

  return useQuery({
    queryKey: ["students-approval-status", user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) return false;
        const { data } = await get<ListStudentsApprovalStatusProps>(
          `/users/${user?.id}/approval-status`,
        );
        return data.isApproved;
      } catch (error) {
        showErrorToast(
          "Erro",
          "Ocorreu um erro ao buscar o status de aprovação dos alunos",
        );
        throw error;
      }
    },
  });
}
