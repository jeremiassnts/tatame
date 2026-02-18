import { useQuery } from "@tanstack/react-query";
import { useToast } from "../../hooks/use-toast";
import { useApi } from "../../hooks/use-api";

export function useAppStores() {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  const getStoreUrls = useQuery({
    queryKey: ["store-urls"],
    queryFn: async () => {
      try {
        const { data } = await get<any>("/app-stores");
        return data ?? [];
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar as URLs das lojas");
        throw error;
      }
    },
  });

  return {
    getStoreUrls,
  };
}
