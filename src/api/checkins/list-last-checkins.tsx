import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { Checkin } from "@/src/types/models";
import { useQuery } from "@tanstack/react-query";

export interface ListLastCheckinsProps {
  data: Checkin[];
  count: number;
}

export function useListLastCheckins() {
  const { get } = useApi();
  const { showErrorToast } = useToast();
  const { user } = useProfileContext();

  return useQuery({
    queryKey: ["last-checkins", user?.id],
    queryFn: async () => {
      try {
        const { data } = await get<ListLastCheckinsProps>(
          `/checkins/user/${user?.id}/last`,
        );
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
        throw error;
      }
    },
  });
}
