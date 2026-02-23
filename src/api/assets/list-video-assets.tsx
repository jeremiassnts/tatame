import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function useListVideoAssets() {
    const { get } = useApi();
    const { showErrorToast } = useToast();

    return useQuery({
        queryKey: ["videos"],
        queryFn: async () => {
            try {
                const response = await get<{ data: unknown[]; count: number }>(
                    "/assets/videos",
                );
                return response?.data ?? [];
            } catch (error) {
                showErrorToast("Erro", "Ocorreu um erro ao buscar os vídeos");
                throw error;
            }
        },
    });
}
