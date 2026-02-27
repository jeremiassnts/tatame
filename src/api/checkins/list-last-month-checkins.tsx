import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { Checkin } from "@/src/types/models";
import { useQuery } from "@tanstack/react-query";

export interface ListLastMonthCheckinsProps {
  data: Checkin[];
  count: number;
}

export function useListLastMonthCheckins() {
  const { get } = useApi();
  const { showErrorToast } = useToast();
  const { user } = useProfileContext();

  return useQuery({
    queryKey: ["last-month-checkins", user?.id],
    queryFn: async () => {
      try {
        const { data } = await get<any>(
          `/checkins/user/${user?.id}/last-month`,
        );
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
        throw error;
      }
    },
  });
}
