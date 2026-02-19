import { useRoles } from "@/src/api/roles/use-roles";
import { useUsers } from "@/src/api/users/use-users";
import { BackButton } from "@/src/components/back-button";
import { InfoRow } from "@/src/components/personal-data-section/info-row";
import { StudentBelt } from "@/src/components/student-belt";
import AvatarWithDialog from "@/src/components/ui/avatar/avatar-with-dialog";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import {
    CalendarDaysIcon,
    CheckCircleIcon,
    CheckIcon,
    CloseCircleIcon,
    CloseIcon,
    Icon,
    InfoIcon,
    PhoneIcon,
} from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { GENDERS } from "@/src/constants/genders";
import { queryClient } from "@/src/lib/react-query";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import { Instagram } from "lucide-react-native";
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
    firstName: string;
    lastName: string;
    instagram: string;
    phone: string;
    gender: string;
    birth: string;
};

export default function User() {
    const {
        name,
        email,
        imageUrl,
        belt,
        degree,
        approved_at,
        denied_at,
        userId,
        gym_id,
        firstName,
        lastName,
        instagram,
        phone,
        gender,
        birth,
    } = useLocalSearchParams<UserProps>();
    const [approvedAt, setApprovedAt] = useState<string | null>(approved_at);
    const [deniedAt, setDeniedAt] = useState<string | null>(denied_at);
    const { approveStudent, denyStudent } = useUsers();
    const { isHigherRole } = useRoles();
    const router = useRouter();

    function handleApproveStudent() {
        approveStudent()
            .mutateAsync(Number(userId))
            .then(() => {
                queryClient.invalidateQueries({
                    queryKey: ["students-by-gym-id", Number(gym_id)],
                });
                setApprovedAt(new Date().toISOString());
                setDeniedAt(null);
            });
    }

    function handleDenyStudent() {
        denyStudent()
            .mutateAsync(Number(userId))
            .then(() => {
                queryClient.invalidateQueries({
                    queryKey: ["students-by-gym-id", Number(gym_id)],
                });
                setDeniedAt(new Date().toISOString());
                setApprovedAt(null);
            });
    }

    const isWaitingApproval = !approvedAt && !deniedAt;
    const isApproved = approvedAt && !deniedAt;
    const isDenied = deniedAt && !approvedAt;

    const birthDate = birth ? new Date(birth) : null;
    const birthDateOnly = birthDate
        ? new Date(birthDate.valueOf() + birthDate.getTimezoneOffset() * 60 * 1000)
        : null;
    const birthFormatted = birthDateOnly
        ? format(birthDateOnly, "dd/MM/yyyy")
        : null;

    return (
        <SafeAreaView className="flex-1 pl-5 pr-5">
            <ScrollView>
                <VStack className="justify-center items-center">
                    <Box>
                        <AvatarWithDialog fullName={name} imageUrl={imageUrl} size="xl" />
                        {isApproved && (
                            <Icon
                                as={CheckCircleIcon}
                                size="md"
                                className="text-white ml-auto bg-green-500 rounded-full absolute bottom-1 right-1"
                            />
                        )}
                        {isDenied && (
                            <Icon
                                as={CloseCircleIcon}
                                size="md"
                                className="text-white ml-auto bg-red-500 rounded-full absolute bottom-1 right-1"
                            />
                        )}
                    </Box>
                    <Text className="text-white text-lg font-bold mt-3">{name}</Text>
                    <Text className="text-neutral-400 text-md">{email}</Text>
                    <StudentBelt belt={belt} degree={Number(degree)} />
                    {isHigherRole() && isWaitingApproval && (
                        <HStack className="gap-2 mt-6">
                            <Button
                                className="rounded-md border-neutral-600"
                                variant="outline"
                                onPress={handleApproveStudent}
                            >
                                <ButtonIcon
                                    as={CheckIcon}
                                    size="sm"
                                    className="text-green-500"
                                />
                                <ButtonText>Aprovar</ButtonText>
                            </Button>
                            <Button
                                className="rounded-md border-neutral-600"
                                variant="outline"
                                onPress={handleDenyStudent}
                            >
                                <ButtonIcon as={CloseIcon} size="sm" className="text-red-500" />
                                <ButtonText>Reprovar</ButtonText>
                            </Button>
                        </HStack>
                    )}
                    {isHigherRole() && isDenied && (
                        <Button
                            className="rounded-md border-neutral-600 mt-6"
                            variant="outline"
                            onPress={handleApproveStudent}
                        >
                            <ButtonIcon as={CheckIcon} size="sm" className="text-green-500" />
                            <ButtonText>Reativar</ButtonText>
                        </Button>
                    )}
                    <Card className="w-full border-2 border-neutral-800 mt-4 bg-neutral-900">
                        <HStack className="justify-between items-center mb-4">
                            <Heading size="xs" className="text-neutral-400">
                                Dados Pessoais
                            </Heading>
                        </HStack>
                        <VStack className="gap-1">
                            <InfoRow
                                icon={Instagram}
                                label="Instagram"
                                value={instagram}
                                isLink={true}
                                url={`https://www.instagram.com/${instagram}`}
                            />
                            <InfoRow icon={PhoneIcon} label="Telefone" value={phone} />
                            <InfoRow
                                icon={InfoIcon}
                                label="Gênero"
                                value={GENDERS.find((g) => g.value === gender)?.label ?? null}
                            />
                            <InfoRow
                                icon={CalendarDaysIcon}
                                label="Data de nascimento"
                                value={birthFormatted}
                            />
                        </VStack>
                    </Card>
                    <HStack className="justify-center w-full mt-4">
                        <BackButton />
                    </HStack>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}
