import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { useRouter } from "expo-router";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { ArrowLeftIcon } from "../ui/icon";

type BackButtonProps = {
    onPress?: () => void;
    className?: string;
}

export function BackButton({ onPress, className }: BackButtonProps) {
    const router = useRouter();

    return (
        <Button size="sm" className={cn("max-w-[100px]", className)} variant="outline" action="secondary" onPress={onPress ?? router.back}>
            <ButtonIcon color="white" as={ArrowLeftIcon} size="md" />
            <ButtonText className="text-white">Voltar</ButtonText>
        </Button>
    );
}