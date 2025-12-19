import { useAttachments } from "@/src/api/use-attachments";
import { useGyms } from "@/src/api/use-gyms";
import { useRoles } from "@/src/api/use-roles";
import { useUsers } from "@/src/api/use-users";
import { StudentRow } from "@/src/components/student-row";
import AvatarWithDialog from "@/src/components/ui/avatar/avatar-with-dialog";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { queryClient } from "@/src/lib/react-query";
import { useUser } from "@clerk/clerk-expo";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Gym() {
    const { getRole } = useRoles();
    const { data: role } = getRole;
    const { updateGymLogo, uploadImage } = useAttachments();
    const { user } = useUser();
    const { fetchByUser } = useGyms()
    const { data: gym, isLoading: isLoadingGym, refetch: refetchGym } = fetchByUser
    const { getStudentsByGymId } = useUsers()
    const { data: students, isLoading: isLoadingStudents, refetch: refetchStudents } = getStudentsByGymId(gym?.id ?? 0)

    async function updateGymImage(logo: string) {
        if (!gym?.id) return;
        //tries to upload the logo 4 times
        for (let i = 0; i < 4; i++) {
            try {
                const imageUrl = await uploadImage.mutateAsync(logo);
                if (!imageUrl) continue;
                await updateGymLogo.mutateAsync({ logo: imageUrl, gymId: gym.id });
                queryClient.invalidateQueries({ queryKey: ["gym-by-user", user?.id] });
                break;
            } catch (error) {
                console.log(JSON.stringify(error, null, 2));
                continue;
            }
        }
    }

    async function refetchData() {
        await refetchGym();
        await refetchStudents();
    }

    const studentsApproved = students?.filter((student) => student.approved_at)

    return (
        <SafeAreaView className="flex-1 pl-5 pr-5">
            <ScrollView>
                <VStack className="justify-center items-center">
                    <AvatarWithDialog fullName={gym?.name ?? ""} imageUrl={`${process.env.EXPO_PUBLIC_R2_URL}${gym?.logo}`} size="xl" updateImageFn={role == "MANAGER" ? updateGymImage : undefined} />
                    <Text className="text-white text-lg font-bold mt-3 uppercase">
                        {gym?.name}
                    </Text>
                    <Text className="text-neutral-400 text-md">
                        {gym?.address}
                    </Text>
                </VStack>
                <ScrollView className="w-full pt-6">
                    {studentsApproved?.map((student) => (
                        <StudentRow key={student.id} student={student} />
                    ))}
                </ScrollView>
                {studentsApproved && studentsApproved.length === 0 && <Text className="text-neutral-400 text-md text-center">Nenhum aluno aprovado</Text>}
            </ScrollView>
        </SafeAreaView>
    );
}