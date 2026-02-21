import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { Class } from "@/src/types/models";
import { useMutation } from "@tanstack/react-query";
import { useCreateNotification } from "../notifications/use-create-notification";

export function useCreateClass() {
  const { get, post } = useApi();
  const { showErrorToast } = useToast();
  const { mutateAsync: createNotification } = useCreateNotification().create();

  return useMutation({
    mutationFn: async (classData: Class) => {
      try {
        const { data } = await post<any>("/class", {
          gym_id: (classData as any).gym_id ?? classData.gymId,
          instructor_id: (classData as any).instructor_id ?? classData.instructorId,
          created_by: (classData as any).created_by ?? classData.createdBy,
          day: classData.day,
          start: classData.start,
          end: classData.end,
          description: classData.description,
        });
        const created = Array.isArray(data) ? data[0] : data;

        const gymId = (classData as any).gym_id ?? classData.gymId;
        const { data: students } = await get<any>(
          `/users/gym/${gymId}/students`,
        );
        const list = Array.isArray(students) ? students : (students ?? []);
        const approved = list.filter((s: any) => s.approved_at != null);

        const sentBy = (classData as any).created_by ?? classData.createdBy;
        await createNotification({
          title: "Nova aula criada",
          content: "Seu professor cadastrou uma nova aula, venha conferir!",
          recipients: approved.map((s: any) => s.id.toString()),
          channel: "push",
          sent_by: sentBy ?? 0,
          status: "pending",
          viewed_by: [(sentBy ?? "").toString()],
        });

        return created;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao criar a aula");
        throw error;
      }
    },
  });
}
