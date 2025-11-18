import { useMutation } from "@tanstack/react-query";
import { Database } from "../types/database.types";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { createSupabaseClerkClient } from "../utils/supabase";
import { useToast } from "../hooks/use-toast";

export function useCheckins() {
  const { getToken } = useAuth();
  const supabase = createSupabaseClerkClient(getToken());
  const { showErrorToast } = useToast();

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

  return {
    create,
  };
}
