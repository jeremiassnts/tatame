import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { Asset } from "@/src/types/models";
import { useQuery } from "@tanstack/react-query";

export interface ListVideoAssetsProps {
    data: Asset[];
    count: number;
}

export function useListVideoAssets() {
    const { get } = useApi();
    const { showErrorToast } = useToast();

    return useQuery({
        queryKey: ["videos"],
        queryFn: async () => {
            try {
                const response = await get<ListVideoAssetsProps>("/assets/videos");
                return response?.data ?? [];
            } catch (error) {
                showErrorToast("Erro", "Ocorreu um erro ao buscar os vídeos");
                throw error;
            }
        },
    });
}
