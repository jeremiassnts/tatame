import { useMutation, useQuery } from "@tanstack/react-query";
import { useSupabase } from "../hooks/useSupabase";
import { Database } from "../types/database.types";
import { useUsers } from "./use-users";

export type Notification = Database["public"]["Tables"]["notifications"]["Row"] & {
    sent_by_name: string;
    sent_by_image_url: string;
}
export function useNotifications() {
    const supabase = useSupabase();
    const { getUserProfile, getClerkUsers } = useUsers()
    const { data: userProfile } = getUserProfile

    const list = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data, error } = await supabase.from("notifications")
                .select("*, users(clerk_user_id)")
                .or(
                    `recipients.cs.{${userProfile?.id.toString()}},sent_by.eq.${userProfile?.id.toString()}`
                )
            if (error) {
                throw error;
            }
            else if (!data) {
                return [];
            }
            const clerkUsers = await getClerkUsers(data.map((user) => user.users?.clerk_user_id!));
            return data.map((notification) => {
                const clerkUser = clerkUsers?.find(
                    (u) => u.id === notification.users?.clerk_user_id
                );
                return {
                    ...notification,
                    sent_by_name: `${clerkUser?.first_name} ${clerkUser?.last_name}`,
                    sent_by_image_url: clerkUser?.image_url,
                } as Notification;
            })
        }
    })

    const create = useMutation({
        mutationFn: async (notification: Database["public"]["Tables"]["notifications"]["Insert"]) => {
            const { data, error } = await supabase.from("notifications").insert(notification);
            if (error) {
                throw error;
            }
            return data;
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

    return {
        list,
        create,
        update,
    }
}