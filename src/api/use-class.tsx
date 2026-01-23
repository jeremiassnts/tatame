import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";
import { Database } from "../types/database.types";
import { ClassRow } from "../types/extendend-database.types";
import { useCreateNotification } from "./use-create-notification";
import { useUsers } from "./use-users";

export function useClass() {
  const supabase = useSupabase();
  const { showErrorToast } = useToast();
  const { getUserByClerkUserId } = useUsers();
  const { user } = useUser();
  const { create } = useCreateNotification()
  const { mutateAsync: createNotification } = create;

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
                  instructor:users!instructor_id(clerk_user_id),
                  assets:assets!class_id(id, content, type, valid_until, created_at, title)
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

          const instructor_name = nextClass?.instructor?.first_name + (nextClass?.instructor?.last_name ? ` ${nextClass?.instructor?.last_name}` : '')

          return {
            ...nextClass,
            instructor_name,
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
      const { data, error } = await supabase.from("class").insert(classData).select()
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao criar a aula");
        throw error;
      }

      const { data: students } = await supabase.from("users")
        .select("*")
        .eq("gym_id", classData.gym_id)
        .eq("role", "STUDENT")
        .not("approved_at", "is", null);

      await createNotification({
        title: "Nova aula criada",
        content: `Seu professor cadastrou uma nova aula, venha conferir!`,
        recipients: students?.map((student) => student.id.toString()) ?? [],
        channel: "push",
        sent_by: classData.created_by,
        status: "pending",
        viewed_by: [classData.created_by?.toString() ?? ""],
      })

      return data[0];
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
        instructor:users!instructor_id(clerk_user_id),
        assets:assets!class_id(id, content, type, valid_until, created_at, title)
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
          const instructor_name = item.instructor?.first_name + (item.instructor?.last_name ? ` ${item.instructor?.last_name}` : '')
          instructors.push({
            clerk_user_id: item.instructor?.clerk_user_id,
            name: instructor_name
          });
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
    const instructor_name = data[0]?.instructor?.first_name + (data[0]?.instructor?.last_name ? ` ${data[0]?.instructor?.last_name}` : '')
    return {
      ...data[0],
      instructor_name,
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

  const findClassToCheckIn = async (gymId: number, time: string, day: string) => {
    const { data, error } = await supabase.from("class")
      .select("*")
      .eq("gym_id", gymId)
      .eq("day", day)
      .lte("start", time)
      .gte("end", time)

    if (error) {
      console.error(error);
      return null;
    }

    return data[0] as ClassRow;
  }

  return {
    fetchNextClass,
    createClass,
    fetchClasses,
    fetchClassById,
    editClass,
    deleteClass,
    findClassToCheckIn,
  };
}
