import { useAuth } from "@clerk/clerk-expo";
import { createSupabaseClerkClient } from "../utils/supabase";
import { useToast } from "../hooks/use-toast";
import { addDays, format } from "date-fns";
import { Database } from "../types/database.types";
import { ClassRow } from "../types/extendend-database.types";
import { useUsers } from "./use-users";

export function useClass() {
  const { getToken } = useAuth();
  const supabase = createSupabaseClerkClient(getToken());
  const { showErrorToast } = useToast();
  const { getClerkUserById } = useUsers();

  async function fetchNextClass(gymId: number) {
    const { data, error } = await supabase
      .from("class")
      .select(
        `
        *,
        gym:gyms!gym_id(name),
        instructor:users!instructor_id(clerk_user_id)
        `
      )
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

    const instructor = nextClass?.instructor?.clerk_user_id
      ? await getClerkUserById(nextClass.instructor?.clerk_user_id)
      : null;

    return {
      ...nextClass,
      instructor_name: instructor?.name,
    } as ClassRow;
  }

  async function createClass(
    classData: Database["public"]["Tables"]["class"]["Insert"]
  ) {
    const { data, error } = await supabase.from("class").insert(classData);
    if (error) {
      console.log(JSON.stringify(error, null, 2));
      showErrorToast("Erro", "Ocorreu um erro ao criar a aula");
      throw error;
    }
    return data;
  }

  async function fetchClassesByGymId(gymId: number) {
    const { data, error } = await supabase
      .from("class")
      .select(
        `
        *,
        gym:gyms!gym_id(name),
        instructor:users!instructor_id(clerk_user_id)
        `
      )
      .filter("gym_id", "eq", gymId)
      .order("start", { ascending: true });

    if (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar as aulas");
      throw error;
    }
    //fetching instructors
    const instructors: { clerk_user_id: string; name: string }[] = [];
    for (const item of data) {
      if (
        item.instructor?.clerk_user_id &&
        !instructors.some(
          (i) => i.clerk_user_id === item.instructor?.clerk_user_id
        )
      ) {
        const instructor = await getClerkUserById(
          item.instructor?.clerk_user_id
        );
        if (instructor) {
          instructors.push({
            clerk_user_id: item.instructor?.clerk_user_id,
            name: instructor.name,
          });
        }
      }
    }

    return data.map((item) => {
      const instructor = instructors.find(
        (i) => i.clerk_user_id === item.instructor?.clerk_user_id
      );
      return {
        ...item,
        instructor_name: instructor?.name,
      } as ClassRow;
    });
  }

  return {
    fetchNextClass,
    createClass,
    fetchClassesByGymId,
  };
}
