import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { User } from "@/src/types/models";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

type UserDetails = {
  name: string;
} & User;
export interface ListBirthdayUsersProps {
  data: UserDetails[];
  count: number;
}

export function useListBirthdayUsers() {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["birthday-users", format(new Date(), "MM-dd")],
    queryFn: async () => {
      try {
        const { data } = await get<ListBirthdayUsersProps>(
          `/users/birthdays/today`,
        );
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
