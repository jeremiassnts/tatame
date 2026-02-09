import { useQuery } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";

export function useAppStores() {
    const supabase = useSupabase();
    const { showErrorToast } = useToast();

    const getStoreUrls = useQuery({
        queryKey: ["store-urls"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("app_stores")
                .select("*")
                .is("disabled_at", null);

            if (error) {
                showErrorToast("Erro", "Ocorreu um erro ao buscar as URLs das lojas");
                throw error;
            }
            return data;
        },
    });

    return {
        getStoreUrls,
    };
}
