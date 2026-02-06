import { useQuery } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";

export function useUserPlans() {
    const supabase = useSupabase();
    const { showErrorToast } = useToast();

    const getPlansByUser = (userId: number, role: string) => {
        return useQuery({
            queryKey: ["plans-by-user", userId],
            queryFn: async () => {
                if (role !== "MANAGER") {
                    return null;
                }
                const { data, error } = await supabase
                    .from("user_plans")
                    .select("*")
                    .eq("user_id", userId);

                if (error) {
                    showErrorToast("Erro", "Ocorreu um erro ao buscar os planos");
                    throw error;
                }
                return data;
            }
        })
    }

    return {
        getPlansByUser,
    }
}