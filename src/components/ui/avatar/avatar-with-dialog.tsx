import { useToast } from "@/src/hooks/use-toast";
import { queryClient } from "@/src/lib/react-query";
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Pressable } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from ".";
import { Button, ButtonSpinner, ButtonText } from "../button";
import { Image } from "../image";
import { Modal, ModalBackdrop, ModalBody, ModalContent } from "../modal";
import { VStack } from "../vstack";

interface AvatarWithDialogProps {
    fullName: string;
    imageUrl: string;
    children?: React.ReactNode;
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
    avatarImageClassName?: string;
    updateImageFn?: (image: string) => Promise<void>;
}
export default function AvatarWithDialog({ fullName, imageUrl, children, size, className, avatarImageClassName, updateImageFn }: AvatarWithDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { showErrorToast } = useToast();
    const { user } = useUser();

    async function pickImage() {
        if (!updateImageFn) return;

        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                setIsUpdating(true);
                const image = result.assets[0].uri
                await updateImageFn(image);
                setIsUpdating(false);
                setIsOpen(false);
                queryClient.invalidateQueries({ queryKey: ["user-profile"] });
                await user?.reload();
            }
        } catch (error) {
            showErrorToast("Erro", "Ocorreu um erro ao atualizar a imagem");
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <VStack>
            <Pressable onPress={() => setIsOpen(true)}>
                <Avatar size={size} className={className}>
                    <AvatarFallbackText>{fullName}</AvatarFallbackText>
                    <AvatarImage source={{ uri: imageUrl }} className={avatarImageClassName} />
                    {children}
                </Avatar>
            </Pressable>
            <Modal isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}>
                <ModalBackdrop />
                <ModalContent className="p-0 items-center justify-center border-0 bg-transparent">
                    <ModalBody>
                        <Image
                            source={{
                                uri: imageUrl,
                            }}
                            alt="image"
                            size="2xl"
                            resizeMode="contain"
                        />
                        {updateImageFn && <Button variant="solid" className="bg-neutral-200" onPress={pickImage}>
                            {isUpdating && <ButtonSpinner />}
                            {!isUpdating && <ButtonText>
                                Atualizar imagem
                            </ButtonText>}
                        </Button>}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>
    )
}