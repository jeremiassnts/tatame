import { useMutation } from "@tanstack/react-query";
import { useSupabase } from "../hooks/useSupabase";
import { Database } from "../types/database.types";

export function useAssets() {
    const supabase = useSupabase();

    const createAsset = useMutation({
        mutationFn: async (asset: Database["public"]["Tables"]["assets"]["Insert"]) => {
            const { data, error } = await supabase.from("assets").insert(asset);
            if (error) {
                throw error;
            }
            return data;
        }
    });

    const deleteAsset = useMutation({
        mutationFn: async (assetId: number) => {
            const { data, error } = await supabase.from("assets").delete().eq("id", assetId);
            if (error) {
                throw error;
            }
            return data;
        }
    });

    return {
        createAsset,
        deleteAsset,
    }
}