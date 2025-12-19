import { useUsers } from "@/src/api/use-users";
import { StudentBelt } from "@/src/components/student-belt";
import AvatarWithDialog from "@/src/components/ui/avatar/avatar-with-dialog";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { HStack } from "@/src/components/ui/hstack";
import { ArrowLeftIcon, CheckCircleIcon, CheckIcon, CloseCircleIcon, CloseIcon, Icon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { queryClient } from "@/src/lib/react-query";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UserProps = {
    userId: string;
    name: string;
    email: string;
    imageUrl: string;
    belt: string;
    degree: string;
    approved_at: string;
    denied_at: string;
    gym_id: string;
    clerk_user_id: string;
}

export default function User() {
    const { name, email, imageUrl, belt, degree, approved_at, denied_at, userId, gym_id } = useLocalSearchParams<UserProps>();
    const [approvedAt, setApprovedAt] = useState<string | null>(approved_at);
    const [deniedAt, setDeniedAt] = useState<string | null>(denied_at);
    const { approveStudent, denyStudent } = useUsers()
    const router = useRouter()

    function handleApproveStudent() {
        approveStudent.mutateAsync(Number(userId))
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["students-by-gym-id", Number(gym_id)] })
                setApprovedAt(new Date().toISOString());
                setDeniedAt(null);
            })
    }

    function handleDenyStudent() {
        denyStudent.mutateAsync(Number(userId))
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["students-by-gym-id", Number(gym_id)] })
                setDeniedAt(new Date().toISOString());
                setApprovedAt(null);
            })
    }

    const isWaitingApproval = !approvedAt && !deniedAt;
    const isApproved = approvedAt && !deniedAt;
    const isDenied = deniedAt && !approvedAt;

    return (
        <SafeAreaView className="flex-1 pt-14 pl-5 pr-5">
            <VStack className="items-start gap-6 mb-6">
                <Button
                    action="secondary"
                    onPress={() => router.back()}
                    className="bg-neutral-800"
                >
                    <ButtonIcon as={ArrowLeftIcon} />
                </Button>
            </VStack>
            <ScrollView>
                <VStack className="justify-center items-center">
                    <Box>
                        <AvatarWithDialog fullName={name} imageUrl={imageUrl} size="xl" />
                        {isApproved && <Icon as={CheckCircleIcon} size="md" className="text-white ml-auto bg-green-500 rounded-full absolute bottom-1 right-1" />}
                        {isDenied && <Icon as={CloseCircleIcon} size="md" className="text-white ml-auto bg-red-500 rounded-full absolute bottom-1 right-1" />}
                    </Box>
                    <Text className="text-white text-lg font-bold mt-3">
                        {name}
                    </Text>
                    <Text className="text-neutral-400 text-md">
                        {email}
                    </Text>
                    <StudentBelt belt={belt} degree={Number(degree)} />
                    {isWaitingApproval && <HStack className="gap-2 mt-6">
                        <Button className="rounded-md border-neutral-600" variant="outline" onPress={handleApproveStudent}>
                            <ButtonIcon as={CheckIcon} size="sm" className="text-green-500" />
                            <ButtonText>Aprovar</ButtonText>
                        </Button>
                        <Button className="rounded-md border-neutral-600" variant="outline" onPress={handleDenyStudent}>
                            <ButtonIcon as={CloseIcon} size="sm" className="text-red-500" />
                            <ButtonText>Reprovar</ButtonText>
                        </Button>
                    </HStack>}
                    {isDenied && <Button className="rounded-md border-neutral-600 mt-6" variant="outline" onPress={handleApproveStudent}>
                        <ButtonIcon as={CheckIcon} size="sm" className="text-green-500" />
                        <ButtonText>Reativar</ButtonText>
                    </Button>}
                </VStack>
            </ScrollView>
        </SafeAreaView>
    )
}