import { BaseUserRow } from "@/src/types/extendend-database.types";
import { Instagram } from "lucide-react-native";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { CalendarDaysIcon, InfoIcon, PhoneIcon } from "../ui/icon";
import { VStack } from "../ui/vstack";
import { InfoRow } from "./info-row";

interface PersonalDataSectionProps {
    user: BaseUserRow;
}

export function PersonalDataSection({ user }: PersonalDataSectionProps) {
    return (
        <Card className="w-full border-2 border-neutral-800 mt-4 bg-neutral-900">
            <HStack className="justify-between items-center mb-4">
                <Heading size="xs" className="text-neutral-400">Dados Pessoais</Heading>
            </HStack>
            <VStack className="gap-1">
                <InfoRow icon={Instagram} label="Instagram" value={user.instagram} />
                <InfoRow icon={PhoneIcon} label="Telefone" value={user.phone} />
                <InfoRow icon={InfoIcon} label="Gênero" value={user.gender} />
                <InfoRow icon={CalendarDaysIcon} label="Data de nascimento" value={user.birth} />
            </VStack>
        </Card>
    )
}