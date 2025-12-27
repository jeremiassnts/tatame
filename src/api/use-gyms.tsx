import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";
import { Database } from "../types/database.types";
import { useCreateNotification } from "./use-create-notification";
import { useUsers } from "./use-users";

export function useGyms() {
  const supabase = useSupabase();
  const { showErrorToast } = useToast();
  const { user } = useUser();
  const { getUserByClerkUserId } = useUsers();
  const { create } = useCreateNotification();
  const { mutateAsync: createNotification } = create;

  const createGym = useMutation({
    mutationFn: async (gym: Database["public"]["Tables"]["gyms"]["Insert"]) => {
      const { data, error } = await supabase.from("gyms").upsert(gym).select();
      if (error || !data) {
        showErrorToast("Erro", "Ocorreu um erro ao criar a academia");
        throw error;
      }
      //update the user with the gym_id
      await supabase
        .from("users")
        .update({ gym_id: data[0].id })
        .eq("clerk_user_id", user?.id!);

      return data[0];
    },
  });

  const fetchByUser = useQuery({
    queryKey: ["gym-by-user", user?.id],
    queryFn: async () => {
      const sp_user = await getUserByClerkUserId(user?.id ?? "");
      if (sp_user && sp_user.gym_id) {
        const { data, error } = await supabase
          .from("gyms")
          .select("*")
          .eq("id", sp_user.gym_id);
        if (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar a academia");
          throw error;
        }
        return data[0] as Database["public"]["Tables"]["gyms"]["Row"];
      }
      return null;
    },
  });

  const fetchAll = useQuery({
    queryKey: ["gyms"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gyms").select("*");
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar as academias");
        throw error;
      }
      return data;
    },
  });

  const associateGym = useMutation({
    mutationFn: async (gymId: number) => {
      if (!user?.id) {
        showErrorToast("Erro", "Usuário não encontrado");
        throw new Error("Usuário não encontrado");
      }
      const { data, error } = await supabase.from("users").update({ gym_id: gymId }).eq("clerk_user_id", user.id).select().single();
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao associar a academia");
        throw error;
      }

      if (data.role !== "MANAGER") {
        const { data: manager } = await supabase.from("users")
          .select("*")
          .eq("gym_id", gymId)
          .eq("role", "MANAGER")
          .single();

        await createNotification({
          title: "Novo aluno associado a academia",
          content: `Verifique na lista de alunos para aprovar ou negar a associação`,
          recipients: [manager?.id.toString()],
          channel: "push",
          status: "pending",
          viewed_by: [data.id.toString()],
          sent_by: data.id,
        })
      }
    },
  });

  return {
    createGym,
    fetchByUser,
    fetchAll,
    associateGym,
  };
}
