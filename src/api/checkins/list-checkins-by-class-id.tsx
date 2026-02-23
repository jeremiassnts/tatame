import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { Checkin } from "@/src/types/models";
import { useQuery } from "@tanstack/react-query";

type CheckinDetails = {
  name: string;
  imageUrl: string;
} & Checkin;
export interface ListCheckinsByClassIdProps {
  data: CheckinDetails[];
  count: number;
}

export function useListCheckinsByClassId(classId: number) {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["checkins-by-class-id", classId],
    queryFn: async () => {
      try {
        const { data } = await get<ListCheckinsByClassIdProps>(
          `/checkins/class/${classId}`,
        );
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
        throw error;
      }
    },
  });
}
