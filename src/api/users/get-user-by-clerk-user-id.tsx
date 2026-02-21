import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";

export function useGetUserByClerkUserId() {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return async (clerkUserId: string) => {
    try {
      const { data } = await get<any>(`/users/clerk/${clerkUserId}`);
      return data;
    } catch (error) {
      showErrorToast(
        "Erro",
        "Ocorreu um erro ao buscar o usuário com o Clerk ID",
      );
      throw error;
    }
  };
}
