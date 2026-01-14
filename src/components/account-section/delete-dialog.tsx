import { useUsers } from "@/src/api/use-users";
import { useUserTypeCache } from "@/src/hooks/use-user-type-cache";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import { Button, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon, SlashIcon } from "../ui/icon";
import { Text } from "../ui/text";

export function DeleteDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser()
    const { clearUserType } = useUserTypeCache();
    const router = useRouter();
    const { deleteUser } = useUsers();
    const { mutateAsync: deleteUserFn } = deleteUser;
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDeleteAccount() {
        setIsDeleting(true);
        await user?.delete()
        await deleteUserFn(user?.id ?? "");
        await clearUserType();
        router.replace("/(auth)/sign-in");
        setIsDeleting(false);
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
                    <Icon as={SlashIcon} size="sm" className="text-red-400" />
                    <Text className="text-red-400">Excluir conta</Text>
                </HStack>
            </Pressable>
            <AlertDialog isOpen={isOpen} onClose={handleClose} size="md">
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading className="text-typography-950 font-semibold mb-4" size="md">
                            Certeza que deseja excluir a conta?
                        </Heading>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="">
                        <Button
                            variant="outline"
                            action="secondary"
                            onPress={handleClose}
                            size="sm"
                            disabled={isDeleting}
                        >
                            <ButtonText>Cancelar</ButtonText>
                        </Button>
                        <Button size="sm" onPress={handleDeleteAccount} disabled={isDeleting}>
                            <ButtonText>Excluir conta</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </View>
    )
}