import { useListNotifications } from "@/src/api/notifications/list-notifications";
import { useResendNotification } from "@/src/api/notifications/resend-notification";
import { useViewNotification } from "@/src/api/notifications/view-notification";
import { useIsMediumRole } from "@/src/api/roles/is-medium-role";
import CreateNotificationDialog from "@/src/components/create-notification-dialog";
import NotificationRow from "@/src/components/notification-row";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
    const { user } = useProfileContext();
    const isMediumRole = useIsMediumRole();
    const { data, isLoading, isFetching, refetch } = useListNotifications();
    const {
        mutateAsync: resendNotificationFn,
        isPending: isResendingNotification,
    } = useResendNotification();
    const { mutateAsync: viewNotificationFn } = useViewNotification();

    return (
        <SafeAreaView className="flex-1 pl-5 pr-5 pb-10">
            {isMediumRole() && <CreateNotificationDialog />}
            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading || isFetching}
                        onRefresh={refetch}
                    />
                }
            >
                {data && data.length === 0 && !isLoading && !isFetching && (
                    <Text className="text-white text-center text-md">
                        Nenhuma notificação encontrada
                    </Text>
                )}
                {isLoading ||
                    (isFetching && (
                        <VStack className="gap-4">
                            <Skeleton className="w-full h-20 rounded-md bg-neutral-800" />
                            <Skeleton className="w-full h-20 rounded-md bg-neutral-800" />
                            <Skeleton className="w-full h-20 rounded-md bg-neutral-800" />
                            <Skeleton className="w-full h-20 rounded-md bg-neutral-800" />
                        </VStack>
                    ))}
                {!isLoading && !isFetching && data && data.length > 0 && (
                    <VStack className="gap-4">
                        {data.map((notification) => (
                            <NotificationRow
                                isHigherRole={isMediumRole()}
                                onView={viewNotificationFn}
                                currentUserId={user?.id ?? 0}
                                key={notification.id}
                                notification={notification}
                                onResend={resendNotificationFn}
                                isPendingResending={isResendingNotification}
                            />
                        ))}
                    </VStack>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
