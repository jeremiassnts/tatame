import { Student, useUsers } from "@/src/api/use-users";
import { BELT_COLORS, BELTS } from "@/src/constants/belts";
import { DEGREES } from "@/src/constants/degrees";
import { queryClient } from "@/src/lib/react-query";
import AvatarWithDialog from "../ui/avatar/avatar-with-dialog";
import { Box } from "../ui/box";
import { Button, ButtonIcon } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { CheckCircleIcon, CheckIcon, CloseIcon, Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface StudentRowProps {
    student: Student;
}

export function StudentRow({ student }: StudentRowProps) {
    const { approveStudent, denyStudent } = useUsers()

    function handleApproveStudent() {
        approveStudent.mutateAsync(student.id)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["students-by-gym-id", student.gym_id] })
            })
    }

    function handleDenyStudent() {
        denyStudent.mutateAsync(student.id)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["students-by-gym-id", student.gym_id] })
            })
    }

    const isWaitingApproval = !student.approved_at && !student.denied_at;
    const isApproved = student.approved_at && !student.denied_at;
    console.log(student.gym_id);

    // @ts-ignore
    const beltColor = student.belt ? BELT_COLORS[student.belt] : "#FFFFFF";
    const beltLabel = BELTS.find((b) => b.value === student.belt)?.label;
    // @ts-ignore
    const beltDegree = DEGREES[student.belt][student.degree];
    return (
        <Card className="bg-neutral-800 w-full rounded-md mb-4 pl-0">
            <HStack className="items-center gap-3 border-[${beltColor}]">
                <Box className={`w-2 h-full`} style={{ backgroundColor: beltColor }} />
                <AvatarWithDialog fullName={student.name} imageUrl={student.imageUrl} size="sm" />
                <VStack>
                    <Heading size="sm">{student.name}</Heading>
                    <Text size="sm" className="text-neutral-400">Faixa {beltLabel}, {beltDegree}</Text>
                </VStack>
                {isWaitingApproval && <HStack className="gap-2 ml-auto">
                    <Button className="rounded-md border-neutral-600" variant="outline" onPress={handleApproveStudent}>
                        <ButtonIcon as={CheckIcon} size="sm" className="text-green-500" />
                    </Button>
                    <Button className="rounded-md border-neutral-600" variant="outline" onPress={handleDenyStudent}>
                        <ButtonIcon as={CloseIcon} size="sm" className="text-red-500" />
                    </Button>
                </HStack>}
                {isApproved && <Icon as={CheckCircleIcon} size="md" className="text-green-500 ml-auto" />}
            </HStack>
        </Card>
    )
}