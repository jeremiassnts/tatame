import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";
import { Database } from "../types/database.types";
import { ClassRow } from "../types/extendend-database.types";
import { useUsers } from "./use-users";

export function useClass() {
  const supabase = useSupabase();
  const { showErrorToast } = useToast();
  const { getClerkUserById } = useUsers();
  const { user } = useUser();
  const { getUserByClerkUserId } = useUsers();

  const fetchNextClass = useQuery({
    queryKey: ["next-class"],
    queryFn: async () => {
      if (user?.id) {
        const sp_user = await getUserByClerkUserId(user.id);
        if (sp_user && sp_user.gym_id) {
          const { data, error } = await supabase
            .from("class")
            .select(
              `
                  *,
                  gym:gyms!gym_id(name),
                  instructor:users!instructor_id(clerk_user_id)
                  `
            )
            .filter("gym_id", "eq", sp_user.gym_id)
            .filter("deleted_at", "is", null)
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
      }
      return null;
    },
  });

  const createClass = useMutation({
    mutationFn: async (
      classData: Database["public"]["Tables"]["class"]["Insert"]
    ) => {
      const { data, error } = await supabase.from("class").insert(classData);
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao criar a aula");
        throw error;
      }
      return data;
    },
  });

  const fetchClasses = useQuery({
    queryKey: ["classes"],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      if (!user?.id) return [];
      const sp_user = await getUserByClerkUserId(user.id);
      if (!sp_user?.gym_id) return [];
      const { data, error } = await supabase
        .from("class")
        .select(
          `
        *,
        gym:gyms!gym_id(name),
        instructor:users!instructor_id(clerk_user_id)
        `
        )
        .filter("gym_id", "eq", sp_user.gym_id)
        .filter("deleted_at", "is", null)
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
    },
  });

  async function fetchClassById(classId: number) {
    const { data, error } = await supabase
      .from("class")
      .select(
        `
        *,
        instructor:users!instructor_id(clerk_user_id),
        gym:gyms!gym_id(name, address),
        assets:assets!class_id(id, content, type, valid_until, created_at, title)
        `
      )
      .filter("id", "eq", classId);

    if (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar a próxima aula");
      throw error;
    }
    if (data.length === 0) {
      return null;
    }
    const instructor = data[0]?.instructor?.clerk_user_id
      ? await getClerkUserById(data[0]?.instructor?.clerk_user_id)
      : null;

    return {
      ...data[0],
      instructor_name: instructor?.name,
    } as ClassRow;
  }

  const editClass = useMutation({
    mutationFn: async (
      data: Database["public"]["Tables"]["class"]["Update"]
    ) => {
      if (!data.id) {
        showErrorToast("Erro", "O ID da aula é obrigatório");
        throw new Error("O ID da aula é obrigatório");
      }
      const { error } = await supabase
        .from("class")
        .update(data)
        .eq("id", data.id);
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao editar a aula");
        throw error;
      }
      return data;
    },
  });

  const deleteClass = useMutation({
    mutationFn: async (classId: number) => {
      const { error } = await supabase.from("class").update({
        deleted_at: new Date().toISOString(),
      }).eq("id", classId);

      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao deletar a aula");
        throw error;
      }
    },
  });

  return {
    fetchNextClass,
    createClass,
    fetchClasses,
    fetchClassById,
    editClass,
    deleteClass,
  };
}
