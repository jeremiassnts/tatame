import { useMutation, useQuery } from "@tanstack/react-query";
import { useSendNotification } from "../hooks/use-send-notification";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";
import { queryClient } from "../lib/react-query";
import { Database } from "../types/database.types";
import { useUsers } from "./use-users";

export type Notification = Database["public"]["Tables"]["notifications"]["Row"] & {
    sent_by_name: string;
    sent_by_image_url: string;
}
export function useNotifications() {
    const supabase = useSupabase();
    const { getUserProfile, getClerkUsers, getCurrentUser } = useUsers()
    const { data: userProfile } = getUserProfile
    const { sendNotification } = useSendNotification();
    const { showErrorToast } = useToast();

    const list = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data, error } = await supabase.from("notifications")
                .select("*, users(clerk_user_id)")
                .or(
                    `recipients.cs.{${userProfile?.id.toString()}},sent_by.eq.${userProfile?.id.toString()}`
                )
                .order("created_at", { ascending: true });
            if (error) {
                throw error;
            }
            else if (!data) {
                return [];
            }
            const clerkUsers = await getClerkUsers(data.map((user) => user.users?.clerk_user_id!));
            return data.map((notification) => {
                const clerkUser = clerkUsers?.find(
                    (u: any) => u.id === notification.users?.clerk_user_id
                );
                return {
                    ...notification,
                    sent_by_name: `${clerkUser?.first_name} ${clerkUser?.last_name}`,
                    sent_by_image_url: clerkUser?.image_url,
                } as Notification;
            })
        }
    })

    const listUnread = useQuery({
        queryKey: ["notifications-unread"],
        queryFn: async () => {
            const currentUser = await getCurrentUser();
            const userId = currentUser?.id.toString() ?? "";

            const { data } = await supabase
                .from("notifications")
                .select("*")
                .contains("recipients", [userId])
                .or(`sent_by.neq.${userId},sent_by.is.null`)
                .order("created_at", { ascending: false });
            const filteredData = data?.filter(e => !e.viewed_by?.includes(userId));
            return filteredData;
        }
    })

    const update = useMutation({
        mutationFn: async (notification: Database["public"]["Tables"]["notifications"]["Update"]) => {
            const { data, error } = await supabase.from("notifications").update(notification).eq("id", notification.id);
            if (error) {
                throw error;
            }
            return data;
        }
    })

    const resend = useMutation({
        mutationFn: async (notificationId: number) => {
            const { data, error } = await supabase.from("notifications").select("*").eq("id", notificationId).single();
            if (error) {
                throw error;
            }
            const { mutateAsync: updateNotification } = update

            sendNotification({
                id: data.id,
                channel: "push",
                title: data.title ?? "",
                content: data.content ?? "",
                recipients: data.recipients ?? [],
            }).then(() => {
                updateNotification({
                    id: data.id,
                    status: "sent",
                    sent_at: new Date().toISOString(),
                }).finally(() => {
                    queryClient.invalidateQueries({ queryKey: ["notifications"] });
                })
            }).catch((error) => {
                console.error(error);
                showErrorToast("Erro", "Ocorreu um erro ao enviar a notificação");
                updateNotification({
                    id: data.id,
                    status: "failed",
                }).finally(() => {
                    queryClient.invalidateQueries({ queryKey: ["notifications"] });
                })
            });
        }
    })

    const view = useMutation({
        mutationFn: async ({ id, userId }: { id: number, userId: string }) => {
            const { data: notification } = await supabase.from("notifications").select("*").eq("id", id).single();
            const { error } = await supabase.from("notifications")
                .update({ viewed_by: [...notification.viewed_by, userId] })
                .eq("id", id);

            if (error) {
                showErrorToast("Erro", "Ocorreu um erro ao visualizar a notificação");
                throw error;
            }
        }
    })

    return {
        list,
        update,
        resend,
        listUnread,
        view,
    }
}