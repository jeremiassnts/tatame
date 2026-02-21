import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export function listBirthdayUsers() {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["birthday-users", format(new Date(), "MM-dd")],
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/users/birthdays/today`);
        return data;
      } catch (error) {
        showErrorToast(
          "Erro",
          "Ocorreu um erro ao buscar os usuários de aniversário",
        );
        throw error;
      }
    },
  });
}
