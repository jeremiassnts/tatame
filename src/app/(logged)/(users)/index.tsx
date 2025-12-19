import { useUsers } from "@/src/api/use-users";
import { StudentRow } from "@/src/components/student-row";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { VStack } from "@/src/components/ui/vstack";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Users() {
    const { getStudentsByGymId, getUserProfile } = useUsers()
    const { data: userProfile } = getUserProfile
    const { data: students, isLoading: isLoadingStudents, refetch: refetchStudents } = getStudentsByGymId(userProfile?.gym_id!)

    const studentsWaitingApproval = students?.filter((student) => student.id !== userProfile?.id && !student.approved_at && !student.denied_at)
    const studentsApproved = students?.filter((student) => student.id !== userProfile?.id && student.approved_at)

    return <SafeAreaView className="pt-10 pl-5 pr-5 flex-1 flex flex-col items-start">
        <Badge
            size="lg"
            variant="solid"
            action="muted"
            className="rounded-sm self-start mb-4"
        >
            <BadgeText>ALUNOS</BadgeText>
        </Badge>
        {isLoadingStudents && (<VStack className="w-full pt-4 gap-4">
            <Skeleton className="w-full h-14 rounded-md bg-neutral-800" />
            <Skeleton className="w-full h-14 rounded-md bg-neutral-800" />
            <Skeleton className="w-full h-14 rounded-md bg-neutral-800" />
            <Skeleton className="w-full h-14 rounded-md bg-neutral-800" />
        </VStack>)}
        <ScrollView className="w-full" refreshControl={<RefreshControl refreshing={isLoadingStudents} onRefresh={refetchStudents} />}>
            {studentsWaitingApproval?.map((student) => (
                <StudentRow key={student.id} student={student} />
            ))}
            {studentsApproved?.map((student) => (
                <StudentRow key={student.id} student={student} />
            ))}
        </ScrollView>
    </SafeAreaView>
}