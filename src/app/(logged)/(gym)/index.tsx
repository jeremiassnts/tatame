import { useUpdateGymLogo } from "@/src/api/attachments/update-gym-logo";
import { useUploadImage } from "@/src/api/attachments/upload-image";
import { useIsHigherRole } from "@/src/api/roles/is-higher-role";
import { useListStudentsByGymId } from "@/src/api/users/list-students-by-gym-id";
import { StudentRow } from "@/src/components/student-row";
import AvatarWithDialog from "@/src/components/ui/avatar/avatar-with-dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { queryClient } from "@/src/lib/react-query";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Gym() {
    const isHigherRole = useIsHigherRole();
    const { mutateAsync: uploadImageAsync } = useUploadImage();
    const { mutateAsync: updateGymLogoAsync } = useUpdateGymLogo();
    const { user, gym } = useProfileContext();
    const { data: students, isLoading: isLoadingStudents } =
        useListStudentsByGymId();

    async function updateGymImage(logo: string) {
        if (!gym?.id) return;
        //tries to upload the logo 4 times
        for (let i = 0; i < 4; i++) {
            try {
                const imageUrl = await uploadImageAsync(logo);
                if (!imageUrl) continue;
                await updateGymLogoAsync({ logo: imageUrl, gymId: gym.id });
                queryClient.invalidateQueries({ queryKey: ["gym-by-user", user?.id] });
                break;
            } catch (error) {
                console.log(JSON.stringify(error, null, 2));
                continue;
            }
        }
    }

    const studentsApproved = students?.filter((student) => student.approvedAt);

    return (
        <SafeAreaView className="flex-1 pl-5 pr-5">
            <ScrollView>
                <VStack className="justify-center items-center">
                    <AvatarWithDialog
                        fullName={gym?.name ?? ""}
                        imageUrl={`${process.env.EXPO_PUBLIC_R2_URL}${gym?.logo}`}
                        size="xl"
                        updateImageFn={isHigherRole() ? updateGymImage : undefined}
                    />
                    <Text className="text-white text-lg font-bold mt-3 uppercase">
                        {gym?.name}
                    </Text>
                    <Text className="text-neutral-400 text-md">{gym?.address}</Text>
                </VStack>
                {isLoadingStudents && (
                    <VStack className="w-full pt-6 gap-4">
                        <Skeleton className="w-full h-14 rounded-md bg-neutral-800" />
                        <Skeleton className="w-full h-14 rounded-md bg-neutral-800" />
                        <Skeleton className="w-full h-14 rounded-md bg-neutral-800" />
                        <Skeleton className="w-full h-14 rounded-md bg-neutral-800" />
                        <Skeleton className="w-full h-14 rounded-md bg-neutral-800" />
                    </VStack>
                )}
                {studentsApproved && studentsApproved.length > 0 && (
                    <ScrollView className="w-full pt-6">
                        {studentsApproved?.map((student) => (
                            <StudentRow key={student.id} student={student} />
                        ))}
                    </ScrollView>
                )}
                {studentsApproved && studentsApproved.length === 0 && (
                    <Text className="text-neutral-400 text-md text-center">
                        Nenhum aluno aprovado
                    </Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
