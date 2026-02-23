import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export function useDeleteAsset() {
    const { del } = useApi();
    const { showErrorToast } = useToast();

    return useMutation({
        mutationFn: async (assetId: number) => {
            try {
                const response = await del<{
                    success: boolean;
                    message: string;
                    data: unknown;
                }>(`/assets/${assetId}`);
                return response?.data;
            } catch (error) {
                showErrorToast("Erro", "Ocorreu um erro ao apagar o conteúdo");
                throw error;
            }
        },
    });
}
