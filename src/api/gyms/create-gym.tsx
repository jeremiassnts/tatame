import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
export interface CreateGymProps {
  name: string;
  address: string;
  since: string;
  logo: string;
}

export function useCreateGym() {
  const { post } = useApi();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async ({
      gym,
      userId,
    }: {
      gym: CreateGymProps;
      userId: number;
    }) => {
      try {
        const { data } = await post<any>("/gyms", {
          name: gym.name,
          address: gym.address,
          since: gym.since,
          logo: gym.logo ?? undefined,
          userId: userId,
        });
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao criar a academia");
        throw error;
      }
    },
  });
}
