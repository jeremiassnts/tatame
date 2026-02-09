import { useUsers } from "@/src/api/use-users";
import { StudentRow } from "@/src/components/student-row";
import { Heading } from "@/src/components/ui/heading";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Users() {
    const { getStudentsByGymId } = useUsers();
    const { user } = useProfileContext();
    const {
        data,
        isLoading: isLoadingStudents,
        refetch: refetchStudents,
    } = getStudentsByGymId(user?.gym_id!);

    const students = data?.filter((user) => user.role === "STUDENT");
    const studentsWaitingApproval = students?.filter(
        (student) =>
            student.id !== user?.id && !student.approved_at && !student.denied_at,
    );
    const studentsApproved = students?.filter(
        (student) => student.id !== user?.id && student.approved_at,
    );
    const studentsDenied = students?.filter(
        (student) => student.id !== user?.id && student.denied_at,
    );

    const instructors = data?.filter((user) => user.role === "INSTRUCTOR");
    const instructorsWaitingApproval = instructors?.filter(
        (instructor) =>
            instructor.id !== user?.id &&
            !instructor.approved_at &&
            !instructor.denied_at,
    );
    const instructorsApproved = instructors?.filter(
        (instructor) => instructor.id !== user?.id && instructor.approved_at,
    );
    const instructorsDenied = instructors?.filter(
        (instructor) => instructor.id !== user?.id && instructor.denied_at,
    );

    return (
        <SafeAreaView className="pl-5 pr-5 flex-1 flex flex-col items-start">
            {isLoadingStudents && (
                <VStack className="w-full pt-4 gap-4">
                    <Skeleton className="w-full h-14 rounded-md bg-neutral-800" />
                    <Skeleton className="w-full h-14 rounded-md bg-neutral-800" />
                    <Skeleton className="w-full h-14 rounded-md bg-neutral-800" />
                    <Skeleton className="w-full h-14 rounded-md bg-neutral-800" />
                </VStack>
            )}
            {!isLoadingStudents && (
                <ScrollView
                    className="w-full"
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoadingStudents}
                            onRefresh={refetchStudents}
                        />
                    }
                >
                    <Heading size="md" className="mb-2">
                        Instrutores
                    </Heading>
                    {instructorsWaitingApproval?.map((instructor) => (
                        <StudentRow key={instructor.id} student={instructor} />
                    ))}
                    {instructorsApproved?.map((instructor) => (
                        <StudentRow key={instructor.id} student={instructor} />
                    ))}
                    {instructorsDenied?.map((instructor) => (
                        <StudentRow key={instructor.id} student={instructor} />
                    ))}
                    {instructors?.length == 0 && (
                        <Text className="text-neutral-400 mb-2">
                            Nenhum instrutor encontrado
                        </Text>
                    )}
                    <Heading size="md" className="mb-2">
                        Alunos
                    </Heading>
                    {studentsWaitingApproval?.map((student) => (
                        <StudentRow key={student.id} student={student} />
                    ))}
                    {studentsApproved?.map((student) => (
                        <StudentRow key={student.id} student={student} />
                    ))}
                    {studentsDenied?.map((student) => (
                        <StudentRow key={student.id} student={student} />
                    ))}
                    {students?.length == 0 && (
                        <Text className="text-neutral-400 mb-2">
                            Nenhum aluno encontrado
                        </Text>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
