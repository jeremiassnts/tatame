import { AppStore } from "@/src/types/models";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/use-api";
import { useToast } from "../../hooks/use-toast";

export interface GetStoreUrlsProps {
  data: AppStore[];
  count: number;
}

export function useGetStoreUrls() {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return useQuery({
    queryKey: ["store-urls"],
    queryFn: async () => {
      try {
        const { data } = await get<GetStoreUrlsProps>("/app-stores");
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar as URLs das lojas");
        throw error;
      }
    },
  });
}
