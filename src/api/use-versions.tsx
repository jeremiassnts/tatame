import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "../hooks/useSupabase";

export function useVersions() {
    const supabase = useSupabase();

    const getLastVersion = useQuery({
        queryKey: ["versions"],
        queryFn: async () => {
            const { data, error } = await supabase.from("versions").select("*").eq("disabled_at", null).limit(1);
            if (error) {
                throw error;
            }
            return data[0];
        }
    })

    return {
        getLastVersion,
    }
}