import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";

export function useRoles() {
  const { user } = useUser();
  const supabase = useSupabase();
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
