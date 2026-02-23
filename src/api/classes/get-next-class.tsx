import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function useGetNextClass() {
  const { get } = useApi();
  const { showErrorToast } = useToast();
  const { user } = useProfileContext();

  return useQuery({
    queryKey: ["next-class", user?.id],
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/class/next/${user?.id}`);
        if (!data) return null;
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar a próxima aula");
        throw error;
      }
    },
  });
}
