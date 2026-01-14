import { useNotifications } from "@/src/api/use-notifications";
import { useRoles } from "@/src/api/use-roles";
import { useUsers } from "@/src/api/use-users";
import CreateNotificationDialog from "@/src/components/create-notification-dialog";
import NotificationRow from "@/src/components/notification-row";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useQuery } from "@tanstack/react-query";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
    const { list, resend, view } = useNotifications();
    const { getRole } = useRoles();
    const { data: role } = getRole;
    const { data, isLoading, isFetching, refetch } = list;
    const { mutateAsync: resendNotification, isPending: isResendingNotification } = resend;
    const { getCurrentUser } = useUsers()
    const { data: user } = useQuery({
        queryKey: ["current-user"],
        queryFn: () => getCurrentUser()
    })
    const { mutateAsync: viewNotification } = view;

    return (
        <SafeAreaView className="flex-1 pl-5 pr-5 pb-10">
            {role === "MANAGER" && (
                <CreateNotificationDialog />
            )}
            <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={isLoading || isFetching} onRefresh={refetch} />}>
                {data && data.length == 0 && !isLoading && !isFetching &&
                    <Text className="text-white text-center text-md">Nenhuma notificação encontrada</Text>}
                {isLoading || isFetching && <VStack className="gap-4">
                    <Skeleton className="w-full h-20 rounded-md bg-neutral-800" />
                    <Skeleton className="w-full h-20 rounded-md bg-neutral-800" />
                    <Skeleton className="w-full h-20 rounded-md bg-neutral-800" />
                    <Skeleton className="w-full h-20 rounded-md bg-neutral-800" />
                </VStack>}
                {!isLoading && !isFetching && data && data.length > 0 && <VStack className="gap-4">
                    {data.map((notification) => (
                        <NotificationRow onView={viewNotification} currentUserId={user?.id ?? 0} key={notification.id} notification={notification} role={role} onResend={resendNotification} isPendingResending={isResendingNotification} />
                    ))}
                </VStack>}
            </ScrollView>
        </SafeAreaView >
    )
}