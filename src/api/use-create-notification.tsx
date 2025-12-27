import { useMutation } from "@tanstack/react-query";
import { useSendNotification } from "../hooks/use-send-notification";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";
import { queryClient } from "../lib/react-query";
import { Database } from "../types/database.types";

export function useCreateNotification() {
    const supabase = useSupabase();
    const { sendNotification } = useSendNotification();
    const { showErrorToast } = useToast();

    const create = useMutation({
        mutationFn: async (notification: Database["public"]["Tables"]["notifications"]["Insert"]) => {
            const { data, error } = await supabase.from("notifications").insert(notification)
                .select().single();

            if (error) {
                throw error;
            }
            try {
                await sendNotification({
                    id: data.id,
                    channel: "push",
                    title: data.title ?? "",
                    content: data.content ?? "",
                    recipients: data.recipients ?? [],
                })
                await supabase.from("notifications").update({
                    id: data.id,
                    status: "sent",
                    sent_at: new Date().toISOString(),
                }).eq("id", data.id)
            } catch (error) {
                console.error(error);
                showErrorToast("Erro", "Ocorreu um erro ao enviar a notificação");
                supabase.from("notifications").update({
                    id: data.id,
                    status: "failed",
                }).eq("id", data.id)
            } finally {
                queryClient.invalidateQueries({ queryKey: ["notifications"] });
            }
            return data;
        }
    })

    return {
        create,
    }
}