import { useAuth, useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { createSupabaseClerkClient } from "../utils/supabase";
import { useToast } from "../hooks/use-toast";

export function useRoles() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const supabase = createSupabaseClerkClient(getToken());
  const { showErrorToast } = useToast();

  const getRole = useQuery({
    queryKey: ["role-by-user", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_user_id", user?.id);
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar o cargo");
        throw error;
      }
      return data[0].role;
    },
  });

  return {
    getRole,
  };
}
