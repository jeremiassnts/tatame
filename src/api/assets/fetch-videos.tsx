import { useToast } from "@/src/hooks/use-toast";
import { useSupabase } from "@/src/hooks/useSupabase";
import { useQuery } from "@tanstack/react-query";

export function fetchVideos() {
    const supabase = useSupabase();
    const { showErrorToast } = useToast();

    return useQuery({
        queryKey: ["videos"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("assets")
                .select("*")
                .eq("type", "video")
                .order("created_at", { ascending: false });
            if (error) {
                showErrorToast("Erro", "Ocorreu um erro ao buscar os vídeos");
                throw error;
            }
            return data;
        },
    });
}
