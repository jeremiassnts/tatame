import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ClassDetails } from "./get-class-by-id";

interface GetNextClassResponse {
  data: ClassDetails;
}

export function useGetNextClass() {
  const { get } = useApi();
  const { showErrorToast } = useToast();
  const { gym } = useProfileContext();

  return useQuery({
    queryKey: ["next-class", gym?.id],
    queryFn: async () => {
      try {
        if (!gym?.id) return null;
        const { data } = await get<GetNextClassResponse>(
          `/class/next/${gym?.id}`,
        );
        if (!data) return null;
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar a próxima aula");
        throw error;
      }
    },
  });
}
