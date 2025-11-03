import { useAuth } from "@clerk/clerk-expo";
import { createSupabaseClerkClient } from "../utils/supabase";
import { useToast } from "../hooks/use-toast";
import { addDays, format } from "date-fns";

export function useClass() {
  const { getToken } = useAuth();
  const supabase = createSupabaseClerkClient(getToken());
  const { showErrorToast } = useToast();

  async function fetchNextClass(gymId: number) {
    const { data, error } = await supabase
      .from("class")
      .select("*")
      .filter("gym_id", "eq", gymId)
      .order("start", { ascending: true });

    if (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar a próxima aula");
      throw error;
    }

    if (data.length === 0) {
      return null;
    }

    let today = new Date();
    let nextClass = null;
    while (!nextClass) {
      const dayOfTheWeek = format(today, "EEEE").toUpperCase();
      for (const item of data) {
        if (item.day === dayOfTheWeek) {
          nextClass = item;
          break;
        }
      }
      today = addDays(today, 1);
    }

    return nextClass;
  }

  return {
    fetchNextClass,
  };
}
