import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createSupabaseClerkClient } from "../utils/supabase";
import { useUsers } from "./use-users";
import { useToast } from "../hooks/use-toast";
import { Database } from "../types/database.types";

export default function useGraduation() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const supabase = createSupabaseClerkClient(getToken());
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
          console.log(JSON.stringify(error, null, 2));
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

  return {
    getGraduation,
    createGraduation,
  };
}
