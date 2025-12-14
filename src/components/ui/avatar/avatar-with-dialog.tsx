import { useState } from "react";
import { Pressable } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from ".";
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
}
export default function AvatarWithDialog({ fullName, imageUrl, children, size, className, avatarImageClassName }: AvatarWithDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

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
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>
    )
}