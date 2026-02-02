import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";
import { Database } from "../types/database.types";
import { CheckinRow } from "../types/extendend-database.types";
import { useUsers } from "./use-users";

export function useCheckins() {
  const supabase = useSupabase();
  const { showErrorToast } = useToast();
  const { user } = useUser();
  const { getProfilesInfo } = useUsers();

  const create = useMutation({
    mutationFn: async (
      checkin: Database["public"]["Tables"]["checkins"]["Insert"]
    ) => {
      //verify if the user has already checked in for this class
      const { data: checkinData } = await supabase.from("checkins")
        .select("*")
        .eq("classId", checkin.classId)
        .eq("userId", checkin.userId)
      if (checkinData && checkinData.length > 0) {
        return;
      }
      const { error } = await supabase.from("checkins").insert(checkin);
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao criar o checkin");
        throw error;
      }
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
        .select("*, users!inner(clerk_user_id)")
        .eq("users.clerk_user_id", user?.id!)
        .eq("date", new Date().toISOString());

      if (error) {
        console.error(error);
        showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
        throw error;
      }

      return data;
    },
  });

  const fetchAllByClassId = (classId: number) => useQuery({
    queryKey: ["just-checkins-by-class-id", classId],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("checkins")
        .select("*, users!inner(clerk_user_id)")
        .eq("users.clerk_user_id", user?.id!)
        .eq("date", new Date().toISOString())
        .eq("classId", classId);

      if (error) {
        console.error(error);
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
        .select("*, users!inner(clerk_user_id)")
        .eq("users.clerk_user_id", user?.id!)
        .gte('date', subDays(new Date(), 15).toISOString())
        .lte('date', new Date().toISOString())

      if (error) {
        console.error(error);
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
          console.error(error);
          showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
          throw error;
        }

        const users = await getProfilesInfo(data.map(item => item.users?.clerk_user_id));

        return data.map((checkin) => {
          return {
            ...checkin,
            name: users.find(u => u.clerk_user_id === checkin.users?.clerk_user_id)?.name,
            imageUrl: users.find(u => u.clerk_user_id === checkin.users?.clerk_user_id)?.imageUrl,
          };
        });
      },
    });
  };

  const fetchLastMonthCheckins = useQuery({
    queryKey: ["last-month-checkins"],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("checkins")
        .select("*, users!inner(clerk_user_id), class!inner(id, start, end, day)")
        .eq("users.clerk_user_id", user?.id!)
        .gte('date', subDays(new Date(), 30).toISOString())
        .lte('date', new Date().toISOString())
        .order('date', { ascending: false })

      if (error) {
        console.error(error);
        showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
        throw error;
      }

      return data as CheckinRow[];
    },
  });

  return {
    create,
    fetchAll,
    remove,
    fetchByClassId,
    fetchLastCheckins,
    fetchLastMonthCheckins,
    fetchAllByClassId,
  };
}
