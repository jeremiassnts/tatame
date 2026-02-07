import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";

export function useUserPlans() {
    const supabase = useSupabase();
    const { showErrorToast } = useToast();
    const { userId } = useAuth();

    const getPlansByUser = useQuery({
        queryKey: ["plans-by-user", userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("user_plans")
                .select("*, users(clerk_user_id)")
                .eq("users.clerk_user_id", userId);

            if (error) {
                showErrorToast("Erro", "Ocorreu um erro ao buscar os planos");
                console.error(JSON.stringify(error, null, 2));
                throw error;
            }
            return data;
        },
    });

    return {
        getPlansByUser,
    };
}
