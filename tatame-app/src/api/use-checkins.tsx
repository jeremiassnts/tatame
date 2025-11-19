import { useMutation, useQuery } from "@tanstack/react-query";
import { Database } from "../types/database.types";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { createSupabaseClerkClient } from "../utils/supabase";
import { useToast } from "../hooks/use-toast";

export function useCheckins() {
  const { getToken } = useAuth();
  const supabase = createSupabaseClerkClient(getToken());
  const { showErrorToast } = useToast();
  const { user } = useUser();

  const create = useMutation({
    mutationFn: async (
      checkin: Database["public"]["Tables"]["checkins"]["Insert"]
    ) => {
      const { data, error } = await supabase.from("checkins").insert(checkin);
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao criar o checkin");
        throw error;
      }
      return data;
    },
  });

  const remove = useMutation({
    mutationFn: async (
      checkinId: number
    ) => {
      const { data, error } = await supabase.from("checkins").delete().eq("id", checkinId);
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao apagar o checkin");
        throw error;
      }
      return data;
    },
  });

  const fetchAll = useQuery({
    queryKey: ["checkins"],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("checkins")
        .select("*, users(clerk_user_id)")
        .eq("users.clerk_user_id", user?.id!)
        .eq("date", new Date().toISOString());

      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
        throw error;
      }

      return data;
    },
  });

  return {
    create,
    fetchAll,
    remove
  };
}
