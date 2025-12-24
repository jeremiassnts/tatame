import { useNotifications } from "@/src/api/use-notifications";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
    const { list } = useNotifications();
    const { data, isLoading, isFetching, refetch } = list;

    return (
        <SafeAreaView>
            <ScrollView refreshControl={<RefreshControl refreshing={isLoading || isFetching} onRefresh={refetch} />}>
                <VStack>
                    {data && data.length == 0 && !isLoading && !isFetching &&
                        <Text className="text-white text-center text-md">Nenhuma notificação encontrada</Text>}
                </VStack>
            </ScrollView>
        </SafeAreaView>
    )
}