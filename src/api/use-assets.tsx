import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";
import { Database } from "../types/database.types";

export function useAssets() {
    const supabase = useSupabase();
    const { showErrorToast } = useToast()

    const createAsset = useMutation({
        mutationFn: async (asset: Database["public"]["Tables"]["assets"]["Insert"]) => {
            const { data, error } = await supabase.from("assets").insert(asset);
            if (error) {
                showErrorToast("Erro", "Ocorreu um erro ao criar o conteúdo");
                throw error;
            }
            return data;
        }
    });

    const deleteAsset = useMutation({
        mutationFn: async (assetId: number) => {
            const { data, error } = await supabase.from("assets").delete().eq("id", assetId);
            if (error) {
                showErrorToast("Erro", "Ocorreu um erro ao apagar o conteúdo");
                throw error;
            }
            return data;
        }
    });

    const fetchVideos = useQuery({
        queryKey: ["videos"],
        queryFn: async () => {
            const { data, error } = await supabase.from("assets").select("*").eq("type", "video").order("created_at", { ascending: false });
            if (error) {
                showErrorToast("Erro", "Ocorreu um erro ao buscar os vídeos");
                throw error;
            }
            return data;
        }
    });

    return {
        createAsset,
        deleteAsset,
        fetchVideos,
    }
}