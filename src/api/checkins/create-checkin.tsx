import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { CreateCheckinProps } from "./types";

export function useCreateCheckin() {
  const { get, post } = useApi();
  const { showErrorToast } = useToast();

  return useMutation({
    mutationFn: async (checkin: CreateCheckinProps) => {
      try {
        const { data: existing } = await get<any>(
          `/checkins/class/${checkin.classId}/user/${checkin.userId}`,
        );
        const list = Array.isArray(existing) ? existing : (existing ?? []);
        if (list.length > 0) return;
        await post("/checkins", {
          userId: checkin.userId,
          classId: checkin.classId,
          date: checkin.date ?? new Date().toISOString(),
        });
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao criar o checkin");
        throw error;
      }
    },
  });
}
