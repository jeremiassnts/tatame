import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { Asset } from "@/src/types/models";
import { useMutation } from "@tanstack/react-query";

export function useCreateAsset() {
    const { post } = useApi();
    const { showErrorToast } = useToast();

    return useMutation({
        mutationFn: async (asset: Partial<Asset>) => {
            try {
                const body = {
                    class_id: asset.classId ?? null,
                    title: asset.title ?? null,
                    content: asset.content ?? null,
                    type: asset.type ?? null,
                    valid_until: asset.validUntil
                        ? new Date(asset.validUntil).toISOString()
                        : null,
                };
                const response = await post<{ data: Asset; created: boolean }>(
                    "/assets",
                    body,
                );
                return response?.data;
            } catch (error) {
                showErrorToast("Erro", "Ocorreu um erro ao criar o conteúdo");
                throw error;
            }
        },
    });
}
