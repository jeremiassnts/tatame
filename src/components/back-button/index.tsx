import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { RelativePathString, useRouter } from "expo-router";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { ArrowLeftIcon } from "../ui/icon";

type BackButtonProps = {
    onPress?: () => void;
    className?: string;
    backTo?: RelativePathString;
};

export function BackButton({ onPress, className, backTo }: BackButtonProps) {
    const router = useRouter();

    function handleBack() {
        if (backTo) {
            router.navigate(backTo);
        } else {
            router.back();
        }
    }

    return (
        <Button
            size="sm"
            className={cn("max-w-[100px]", className)}
            variant="outline"
            action="secondary"
            onPress={onPress ?? handleBack}
        >
            <ButtonIcon color="white" as={ArrowLeftIcon} size="md" />
            <ButtonText className="text-white">Voltar</ButtonText>
        </Button>
    );
}
