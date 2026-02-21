import { useToast } from "@/src/hooks/use-toast";
import { useSupabase } from "@/src/hooks/useSupabase";
import { useMutation } from "@tanstack/react-query";

export function useDeleteAsset() {
    const supabase = useSupabase();
    const { showErrorToast } = useToast();

    return useMutation({
        mutationFn: async (assetId: number) => {
            const { data, error } = await supabase
                .from("assets")
                .delete()
                .eq("id", assetId);
            if (error) {
                showErrorToast("Erro", "Ocorreu um erro ao apagar o conteúdo");
                throw error;
            }
            return data;
        },
    });
}
