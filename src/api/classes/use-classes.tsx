import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/use-api";
import { useToast } from "../../hooks/use-toast";
import { Database } from "../../types/database.types";
import { ClassRow } from "../../types/extendend-database.types";
import { useCreateNotification } from "../notifications/use-create-notification";

function mapToClassRow(item: any): ClassRow {
  const instructor = item?.instructor
    ? [item.instructor.first_name ?? "", item.instructor.last_name ?? ""]
      .join(" ")
      .trim()
    : "";
  return {
    ...item,
    instructor_name: instructor,
  } as ClassRow;
}

export function useClasses() {
  const { get, post, put, del } = useApi();
  const { showErrorToast } = useToast();
  const { mutateAsync: createNotification } = useCreateNotification().create;

  const fetchNextClass = (userId: number) =>
    useQuery({
      queryKey: ["next-class", userId],
      queryFn: async () => {
        try {
          const { data } = await get<any>(`/class/next/${userId}`);
          if (!data) return null;
          const raw = Array.isArray(data) ? data[0] : data;
          return raw ? mapToClassRow(raw) : null;
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar a próxima aula");
          throw error;
        }
      },
    });

  const createClass = useMutation({
    mutationFn: async (
      classData: Database["public"]["Tables"]["class"]["Insert"],
    ) => {
      try {
        const { data } = await post<any>("/class", {
          gym_id: classData.gym_id,
          instructor_id: classData.instructor_id,
          created_by: classData.created_by,
          day: classData.day,
          start: classData.start,
          end: classData.end,
          description: classData.description,
        });
        const created = Array.isArray(data) ? data[0] : data;

        const { data: students } = await get<any>(
          `/users/gym/${classData.gym_id}/students`,
        );
        const list = Array.isArray(students) ? students : (students ?? []);
        const approved = list.filter((s: any) => s.approved_at != null);

        await createNotification({
          title: "Nova aula criada",
          content: "Seu professor cadastrou uma nova aula, venha conferir!",
          recipients: approved.map((s: any) => s.id.toString()),
          channel: "push",
          sent_by: classData.created_by ?? 0,
          status: "pending",
          viewed_by: [(classData.created_by ?? "").toString()],
        });

        return created;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao criar a aula");
        throw error;
      }
    },
  });

  const fetchClasses = (gymId: number) =>
    useQuery({
      queryKey: ["classes", gymId],
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      queryFn: async () => {
        try {
          const { data } = await get<any>(`/class/gym/${gymId}`);
          const list = Array.isArray(data) ? data : (data ?? []);
          return list.map(mapToClassRow);
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar as aulas");
          throw error;
        }
      },
    });

  async function fetchClassById(classId: number) {
    try {
      const { data } = await get<any>(`/class/${classId}`);
      const raw = Array.isArray(data) ? data[0] : data;
      if (!raw) return null;
      return mapToClassRow(raw);
    } catch (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar a próxima aula");
      throw error;
    }
  }

  const editClass = useMutation({
    mutationFn: async (
      payload: Database["public"]["Tables"]["class"]["Update"],
    ) => {
      if (!payload.id) {
        showErrorToast("Erro", "O ID da aula é obrigatório");
        throw new Error("O ID da aula é obrigatório");
      }
      try {
        await put(`/class/${payload.id}`, payload);
        return payload;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao editar a aula");
        throw error;
      }
    },
  });

  const deleteClass = useMutation({
    mutationFn: async (classId: number) => {
      try {
        await del(`/class/${classId}`);
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao deletar a aula");
        throw error;
      }
    },
  });

  const findClassToCheckIn = async (
    gymId: number,
    time: string,
    day: string,
  ) => {
    try {
      const { data } = await get<any>(
        `/class/check-in/available?gymId=${gymId}&time=${encodeURIComponent(time)}&day=${encodeURIComponent(day)}`,
      );
      const raw = Array.isArray(data) ? data[0] : data;
      return raw ? mapToClassRow(raw) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

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
