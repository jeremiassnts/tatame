import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";
import { Database } from "../types/database.types";
import { useUsers } from "./use-users";

export function useCheckins() {
  const supabase = useSupabase();
  const { showErrorToast } = useToast();
  const { user } = useUser();
  const { getClerkUsers } = useUsers();

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
    mutationFn: async (checkinId: number) => {
      const { data, error } = await supabase
        .from("checkins")
        .delete()
        .eq("id", checkinId);
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

  const fetchLastCheckins = useQuery({
    queryKey: ["last-checkins"],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("checkins")
        .select("*, users(clerk_user_id)")
        .eq("users.clerk_user_id", user?.id!)
        .gte('date', subDays(new Date(), 15).toISOString())
        .lte('date', new Date().toISOString())

      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
        throw error;
      }

      return data;
    },
  });

  const fetchByClassId = (classId: number) => {
    return useQuery({
      queryKey: ["checkins-by-class-id", classId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("checkins")
          .select("*, users(clerk_user_id)")
          .eq("classId", classId)
          .eq("date", new Date().toISOString());
        if (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
          throw error;
        }
        const userIds = data
          .map((checkin) => checkin?.users?.clerk_user_id)
          .filter((id) => id !== undefined);
        const clerkUsers = await getClerkUsers(userIds);

        return data.map((checkin) => {
          const clerkUser = clerkUsers?.find(
            (user) => user.id === checkin.users?.clerk_user_id
          );
          return {
            ...checkin,
            name: `${clerkUser?.first_name} ${clerkUser?.last_name}`,
            imageUrl: clerkUser?.image_url,
          };
        });
      },
    });
  };

  return {
    create,
    fetchAll,
    remove,
    fetchByClassId,
    fetchLastCheckins,
  };
}
