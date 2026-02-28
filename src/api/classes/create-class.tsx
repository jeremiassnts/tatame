import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useCreateNotification } from "../notifications/create-notification";

export interface CreateClassProps {
  gymId: number;
  instructorId: number;
  createdBy: number;
  day: string;
  start: string;
  end: string;
  description: string;
  modality: string;
}

export function useCreateClass() {
  const { get, post } = useApi();
  const { showErrorToast } = useToast();
  const { mutateAsync: createNotificationFn } = useCreateNotification();

  return useMutation({
    mutationFn: async (classData: CreateClassProps) => {
      try {
        const { data } = await post<any>("/class", {
          gymId: (classData as any).gymId ?? classData.gymId,
          instructorId:
            (classData as any).instructorId ?? classData.instructorId,
          createdBy: (classData as any).createdBy ?? classData.createdBy,
          day: classData.day,
          start: classData.start,
          end: classData.end,
          description: classData.description,
        });
        const created = Array.isArray(data) ? data[0] : data;

        const gymId = (classData as any).gymId ?? classData.gymId;
        const { data: students } = await get<any>(
          `/users/gym/${gymId}/students`,
        );
        const list = Array.isArray(students) ? students : (students ?? []);
        const approved = list.filter((s: any) => s.approvedAt != null);

        const sentBy = (classData as any).createdBy ?? classData.createdBy;
        await createNotificationFn({
          title: "Nova aula criada",
          content: "Seu professor cadastrou uma nova aula, venha conferir!",
          recipients: approved.map((s: any) => s.id.toString()),
          channel: "push",
          sentBy: sentBy ?? 0,
          status: "pending",
          viewedBy: [(sentBy ?? "").toString()],
        });

        return created;
      } catch (error: any) {
        const msg =
          error?.response?.data?.message ?? "Ocorreu um erro ao criar a aula";
        showErrorToast("Erro", msg);
        throw error;
      }
    },
  });
}
