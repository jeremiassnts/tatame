import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "../hooks/useSupabase";

export function useNotifications() {
    const supabase = useSupabase();
    const { user } = useUser();

    const list = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data, error } = await supabase.from("notifications")
                .select("*")
                .contains("recipients", [user?.id]);

            if (error) {
                throw error;
            }
            return data;
        }
    })

    return {
        list,
    }
}