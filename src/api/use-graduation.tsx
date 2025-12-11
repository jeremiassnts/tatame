import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";
import { Database } from "../types/database.types";
import { useUsers } from "./use-users";

export default function useGraduation() {
  const { user } = useUser();
  const supabase = useSupabase();
  const { getUserByClerkUserId } = useUsers();
  const { showErrorToast } = useToast();

  const getGraduation = useQuery({
    queryKey: ["graduation"],
    queryFn: async () => {
      const sp_user = await getUserByClerkUserId(user?.id!);
      if (sp_user) {
        const { data, error } = await supabase
          .from("graduations")
          .select("*")
          .eq("userId", sp_user.id);

        if (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar a graduação");
          throw error;
        }
        if (data.length == 0) {
          return null;
        }

        return data[0];
      }
    },
  });

  const createGraduation = useMutation({
    mutationFn: async (
      graduation: Database["public"]["Tables"]["graduations"]["Insert"]
    ) => {
      const { data, error } = await supabase
        .from("graduations")
        .insert(graduation)
        .select();
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao criar a graduação");
        throw error;
      }
      return data[0];
    },
  });

  const updateGraduation = useMutation({
    mutationFn: async (graduation: Database["public"]["Tables"]["graduations"]["Update"]) => {
      const { error } = await supabase.from("graduations").update(graduation).eq("id", graduation.id);
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao atualizar a graduação");
        throw error;
      }
    },
  });

  return {
    getGraduation,
    createGraduation,
    updateGraduation,
  };
}
