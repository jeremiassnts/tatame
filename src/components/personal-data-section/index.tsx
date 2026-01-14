import { GENDERS } from "@/src/constants/genders";
import { BaseUserRow } from "@/src/types/extendend-database.types";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { Instagram } from "lucide-react-native";
import { Button, ButtonText } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { CalendarDaysIcon, InfoIcon, PhoneIcon } from "../ui/icon";
import { VStack } from "../ui/vstack";
import { InfoRow } from "./info-row";

interface PersonalDataSectionProps {
    user: BaseUserRow;
    firstName: string;
    lastName: string;
}

export function PersonalDataSection({ user, firstName, lastName }: PersonalDataSectionProps) {
    const router = useRouter();

    function handleEditProfile() {
        router.push({
            pathname: "/(logged)/(profile)/edit-profile",
            params: {
                id: user.id.toString(),
                firstName: firstName,
                lastName: lastName,
                instagram: user.instagram,
                phone: user.phone,
                gender: user.gender,
                birth: user.birth,
            },
        });
    }

    const birthDate = user.birth ? new Date(user.birth) : null;
    const birthDateOnly = birthDate ? new Date(birthDate.valueOf() + birthDate.getTimezoneOffset() * 60 * 1000) : null;
    const birthFormatted = birthDateOnly ? format(birthDateOnly, "dd/MM/yyyy") : null;

    return (
        <Card className="w-full border-2 border-neutral-800 mt-4 bg-neutral-900">
            <HStack className="justify-between items-center mb-4">
                <Heading size="xs" className="text-neutral-400">Dados Pessoais</Heading>
                <Button variant="link" size="sm" onPress={handleEditProfile}>
                    <ButtonText>Editar</ButtonText>
                </Button>
            </HStack>
            <VStack className="gap-1">
                <InfoRow icon={Instagram} label="Instagram" value={user.instagram} isLink={true} url={`https://www.instagram.com/${user.instagram}`} />
                <InfoRow icon={PhoneIcon} label="Telefone" value={user.phone} />
                <InfoRow icon={InfoIcon} label="Gênero" value={GENDERS.find((gender) => gender.value === user.gender)?.label ?? null} />
                <InfoRow icon={CalendarDaysIcon} label="Data de nascimento" value={birthFormatted} />
            </VStack>
        </Card>
    )
}