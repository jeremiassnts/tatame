import { useDeleteAsset } from "@/src/api/assets/delete-asset";
import { useListVideoAssets } from "@/src/api/assets/list-video-assets";
import { useIsMediumRole } from "@/src/api/roles/is-medium-role";
import { AddVideoToLibrary } from "@/src/components/add-video-to-library";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { VideoRow } from "@/src/components/video-row";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Library() {
    const isMediumRole = useIsMediumRole();
    const deleteAssetMutation = useDeleteAsset();
    const { data, isLoading, isFetching, refetch } = useListVideoAssets();

    return (
        <SafeAreaView className="flex-1 pl-4 pr-4">
            <ScrollView
                className="w-full"
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading || isFetching}
                        onRefresh={refetch}
                    />
                }
            >
                {(isLoading || isFetching) && (
                    <VStack className="gap-4 w-full">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="w-full h-[100px] rounded-md bg-neutral-800"
                            />
                        ))}
                    </VStack>
                )}
                {!isLoading && !isFetching && data?.length === 0 && (
                    <Text className="text-white text-center text-md">
                        Nenhum vídeo encontrado
                    </Text>
                )}
                {!isLoading && !isFetching && data && data.length > 0 && (
                    <VStack className="gap-4">
                        {data.map((video) => (
                            <VideoRow
                                id={video.id}
                                key={video.id}
                                video={`${process.env.EXPO_PUBLIC_R2_URL}${video.content}`}
                                createdAt={video.createdAt?.toISOString() ?? ""}
                                title={video.title ?? ""}
                                onDelete={deleteAssetMutation}
                            />
                        ))}
                    </VStack>
                )}
            </ScrollView>
            {isMediumRole() && <AddVideoToLibrary />}
        </SafeAreaView>
    );
}
