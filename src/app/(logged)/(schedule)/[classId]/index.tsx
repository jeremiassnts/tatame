import { useDeleteAsset } from "@/src/api/assets/delete-asset";
import { useDeleteClass } from "@/src/api/classes/delete-class";
import { useGetClassById } from "@/src/api/classes/get-class-by-id";
import { useIsHigherRole } from "@/src/api/roles/is-higher-role";
import { useIsLowerRole } from "@/src/api/roles/is-lower-role";
import { useIsMediumRole } from "@/src/api/roles/is-medium-role";
import { AddContent } from "@/src/components/add-content";
import { BackButton } from "@/src/components/back-button";
import { CheckIn } from "@/src/components/class-card/check-in";
import { CheckIns } from "@/src/components/class-card/check-ins";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { Divider } from "@/src/components/ui/divider";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import {
    CalendarDaysIcon,
    CloseIcon,
    EditIcon,
    Icon,
    InfoIcon,
    LocationIcon,
    TrashIcon,
    UserIcon,
} from "@/src/components/ui/icon";
import { Image } from "@/src/components/ui/image";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { VideoPlayer } from "@/src/components/video-player";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { queryClient } from "@/src/lib/react-query";
import { formatDay, formatTime } from "@/src/utils/class";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter, startOfWeek } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ClassProps = {
    classId: string;
    classDate: string;
};

export default function Class() {
    const { classId, classDate } = useLocalSearchParams<ClassProps>();
    const { user } = useProfileContext();
    const getClassById = useGetClassById();
    const isHigherRole = useIsHigherRole();
    const isLowerRole = useIsLowerRole();
    const isMediumRole = useIsMediumRole();
    const { data, isLoading, refetch, isFetching } = useQuery({
        queryKey: ["class", classId],
        queryFn: () => getClassById(parseInt(classId)),
    });
    const router = useRouter();
    const { mutateAsync: deleteClassFn } = useDeleteClass();
    const { mutateAsync: deleteAssetFn, isPending: isDeletingAsset } =
        useDeleteAsset();
    const startOfWeekDate = startOfWeek(new Date(classDate));

    async function handleDeleteAsset(assetId: number) {
        if (isDeletingAsset) {
            return;
        }
        await deleteAssetFn(assetId);
        refetch();
    }

    function handleEditClass() {
        router.push({
            pathname: "/(logged)/(schedule)/edit-class",
            params: {
                classId: data?.id,
                gymId: data?.gymId ?? 0,
            },
        });
    }

    async function handleDeleteClass() {
        await deleteClassFn(data?.id ?? 0);
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        queryClient.invalidateQueries({ queryKey: ["next-class"] });
        queryClient.invalidateQueries({ queryKey: ["class", data?.id] });
        router.replace("/(logged)/(schedule)");
    }

    async function handleGoBack() {
        router.navigate("/(logged)/(schedule)");
    }

    const instructions =
        data && data.assets
            ? data.assets.filter(
                (a) =>
                    a.type === "text" &&
                    isAfter(new Date(a.validUntil ?? ""), startOfWeekDate),
            )
            : [];
    const videos =
        data && data.assets
            ? data.assets.filter(
                (a) =>
                    a.type === "video" &&
                    isAfter(new Date(a.validUntil ?? ""), startOfWeekDate),
            )
            : [];

    const canManageClass =
        isHigherRole() || (isMediumRole() && data?.instructorId === user?.id);

    return (
        <SafeAreaView className="flex-1">
            {(isLoading || isFetching) && (
                <VStack className="gap-4 pr-5 pl-5">
                    <Skeleton className="w-full h-[150px] bg-neutral-800 rounded-md" />
                    <Skeleton className="w-full h-10 bg-neutral-800 rounded-md" />
                    <Skeleton className="w-full h-[100px] bg-neutral-800 rounded-md" />
                </VStack>
            )}
            {!isLoading && !isFetching && data && (
                <ScrollView>
                    <VStack>
                        <BackButton className="mb-4 ml-4" onPress={handleGoBack} />
                        <Image
                            alt="background"
                            source={{ uri: require("@/assets/images/class-bg.jpeg") }}
                            className="w-full h-[200px] rounded-md opacity-60"
                            resizeMode="cover"
                        />
                        <VStack className="p-5">
                            <HStack className="justify-between items-center w-full">
                                <Heading className="w-[50%]" size="xl">
                                    {data.description}
                                </Heading>
                                {isLowerRole() && (
                                    <CheckIn class={data} classDate={classDate} />
                                )}
                            </HStack>
                            <CheckIns classId={data.id} />
                            <Divider className="my-4" />
                            <VStack className="gap-2">
                                <HStack className="gap-2 items-center">
                                    <Icon
                                        as={CalendarDaysIcon}
                                        size="md"
                                        className="text-neutral-400"
                                    />
                                    <Text className="text-white">
                                        {formatDay(data.day)} / {formatTime(data.start)} -{" "}
                                        {formatTime(data.end)}
                                    </Text>
                                </HStack>
                                <HStack className="gap-2 items-center">
                                    <Icon as={UserIcon} size="md" className="text-neutral-400" />
                                    <Text className="text-white">{data.instructorName}</Text>
                                </HStack>
                                <HStack className="gap-2 items-center">
                                    <Icon
                                        as={LocationIcon}
                                        size="md"
                                        className="text-neutral-400"
                                    />
                                    <Text className="text-white">
                                        {data.gym.name} - {data.gym.address}
                                    </Text>
                                </HStack>
                                <HStack className="gap-2 items-center">
                                    <Icon as={InfoIcon} size="md" className="text-neutral-400" />
                                    <Text className="text-white capitalize w-full">
                                        {data.modality}
                                    </Text>
                                </HStack>
                            </VStack>
                            <Divider className="my-4" />
                            <VStack className="w-full gap-2">
                                <Heading size="md">Conteúdo</Heading>
                                {videos.length === 0 && instructions.length === 0 && (
                                    <Text className="text-neutral-400">
                                        Seu professor ainda não adicionou conteúdo para a aula
                                    </Text>
                                )}
                                {instructions.length > 0 && (
                                    <VStack className="gap-2 pt-2">
                                        {instructions.map((a) => (
                                            <VStack
                                                key={a.id}
                                                className="bg-neutral-800 rounded-md p-4 gap-2"
                                            >
                                                <HStack className="justify-between items-center">
                                                    <Text
                                                        className="text-neutral-200 max-w-[80%]"
                                                        key={a.id}
                                                    >
                                                        {a.content}
                                                    </Text>
                                                    {canManageClass && (
                                                        <Button
                                                            className="rounded-full w-6 h-6"
                                                            variant="outline"
                                                            size="xs"
                                                            onPress={() => handleDeleteAsset(a.id)}
                                                        >
                                                            <ButtonIcon as={TrashIcon} />
                                                        </Button>
                                                    )}
                                                </HStack>
                                                <Text className="text-neutral-500 text-sm ml-auto">
                                                    Publicado às{" "}
                                                    {format(new Date(a.createdAt), "dd/MM/yyyy HH:mm")}
                                                </Text>
                                            </VStack>
                                        ))}
                                    </VStack>
                                )}

                                {videos.length > 0 && (
                                    <VStack className="gap-2">
                                        {videos.map((a) => (
                                            <Box key={a.id} className="bg-neutral-800 rounded-md p-4">
                                                <HStack className="justify-between items-center mb-4">
                                                    <Heading
                                                        size="md"
                                                        className="text-neutral-200 max-w-[80%]"
                                                    >
                                                        {a.title}
                                                    </Heading>
                                                    {canManageClass && (
                                                        <Button
                                                            className="rounded-full w-6 h-6 ml-auto"
                                                            variant="outline"
                                                            size="xs"
                                                            onPress={() => handleDeleteAsset(a.id)}
                                                        >
                                                            <ButtonIcon as={TrashIcon} />
                                                        </Button>
                                                    )}
                                                </HStack>
                                                <VideoPlayer
                                                    key={a.id}
                                                    video={`${process.env.EXPO_PUBLIC_R2_URL}${a.content}`}
                                                />
                                                <Text className="text-neutral-500 text-sm ml-auto mt-2">
                                                    Publicado às{" "}
                                                    {format(new Date(a.createdAt), "dd/MM/yyyy HH:mm")}
                                                </Text>
                                            </Box>
                                        ))}
                                    </VStack>
                                )}
                            </VStack>
                            {canManageClass && (
                                <HStack className="gap-2 items-center justify-center mt-6 flex-wrap">
                                    <AddContent
                                        classId={data.id}
                                        refetch={refetch}
                                        classDate={classDate}
                                    />
                                    <Button onPress={handleEditClass}>
                                        <ButtonIcon as={EditIcon} />
                                        <ButtonText>Editar</ButtonText>
                                    </Button>
                                    <Button onPress={handleDeleteClass}>
                                        <ButtonIcon as={CloseIcon} />
                                        <ButtonText>Excluir</ButtonText>
                                    </Button>
                                </HStack>
                            )}
                        </VStack>
                    </VStack>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
