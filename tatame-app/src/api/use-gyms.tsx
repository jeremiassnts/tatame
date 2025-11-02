import { useAuth } from "@clerk/clerk-expo";
import { createSupabaseClerkClient } from "../utils/supabase";
import { Database } from "../types/database.types";
import { useToast } from "../hooks/use-toast";

export function useGyms() {
  const { getToken } = useAuth();
  const { showErrorToast } = useToast();

  async function fetchGymByManagerId(managerId: number) {
    const supabase = createSupabaseClerkClient(getToken());
    const { data, error } = await supabase
      .from("gyms")
      .select("*")
      .eq("managerId", managerId);
    if (error) {
      throw error;
    }
    return data[0];
  }

  async function createGym(
    gym: Database["public"]["Tables"]["gyms"]["Insert"]
  ) {
    const supabase = createSupabaseClerkClient(getToken());
    const { data, error } = await supabase.from("gyms").insert(gym);
    if (error) {
      console.log(JSON.stringify(error, null, 2));
      showErrorToast("Erro", "Ocorreu um erro ao criar a academia");
      throw error;
    }
    return data;
  }

  return {
    fetchGymByManagerId,
    createGym,
  };
}
