import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { Checkin } from "@/src/types/models";
import { useQuery } from "@tanstack/react-query";

export interface ListLastCheckinsProps {
  data: Checkin[];
  count: number;
}

export function useListLastCheckins(userId: number) {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["last-checkins", userId],
    queryFn: async () => {
      try {
        const { data } = await get<ListLastCheckinsProps>(
          `/checkins/user/${userId}/last`,
        );
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
        throw error;
      }
    },
  });
}
