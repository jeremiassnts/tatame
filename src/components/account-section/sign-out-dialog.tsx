import { useSignOut } from "@/src/hooks/use-sign-out";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import { Button, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { ExternalLinkIcon, Icon } from "../ui/icon";
import { Text } from "../ui/text";

export function SignOutDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const { signOut } = useSignOut();

    function handleSignOut() {
        signOut();
    }

    function handleClose() {
        setIsOpen(false);
    }

    function handleOpen() {
        setIsOpen(true);
    }

    return (
        <View>
            <Pressable onPress={handleOpen}>
                <HStack className="gap-2 items-center">
                    <Icon as={ExternalLinkIcon} size="sm" className="text-neutral-400" />
                    <Text className="text-neutral-400">Sair da conta</Text>
                </HStack>
            </Pressable>
            <AlertDialog isOpen={isOpen} onClose={handleClose} size="md">
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading className="text-typography-950 font-semibold mb-4" size="md">
                            Certeza que deseja sair da conta?
                        </Heading>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="">
                        <Button
                            variant="outline"
                            action="secondary"
                            onPress={handleClose}
                            size="sm"
                        >
                            <ButtonText>Cancelar</ButtonText>
                        </Button>
                        <Button size="sm" onPress={handleSignOut}>
                            <ButtonText>Sair da conta</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </View>
    )
}