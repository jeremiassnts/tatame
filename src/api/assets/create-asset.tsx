import { useToast } from "@/src/hooks/use-toast";
import { useSupabase } from "@/src/hooks/useSupabase";
import { Asset } from "@/src/types/models";
import { useMutation } from "@tanstack/react-query";

export function useCreateAsset() {
    const supabase = useSupabase();
    const { showErrorToast } = useToast();

    return useMutation({
        mutationFn: async (asset: Asset) => {
            const { data, error } = await supabase.from("assets").insert(asset);
            if (error) {
                showErrorToast("Erro", "Ocorreu um erro ao criar o conteúdo");
                throw error;
            }
            return data;
        },
    });
}
