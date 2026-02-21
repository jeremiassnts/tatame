import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { TextInput } from "../text-input";
import { Button, ButtonIcon } from "../ui/button";
import { Heading } from "../ui/heading";
import { AddIcon, CloseIcon, Icon } from "../ui/icon";
import {
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
} from "../ui/modal";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import VideoPicker from "../video-picker";

const addVideoFormSchema = z.object({
    title: z.string().min(1, "O título do vídeo é obrigatório"),
    content: z.string().min(1, "O vídeo é obrigatório"),
});
type AddVideoFormType = z.infer<typeof addVideoFormSchema>;

export function AddVideoToLibrary() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        watch,
        setValue,
        formState: { errors },
    } = useForm<AddVideoFormType>({
        resolver: zodResolver(addVideoFormSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    });

    const title = watch("title");

    return (
        <View>
            <Button
                size="md"
                variant="solid"
                className="bg-violet-800 rounded-full w-[50px] h-[50px] absolute bottom-20 right-5 z-10"
                onPress={() => setIsOpen(true)}
            >
                <ButtonIcon as={AddIcon} color="white" />
            </Button>
            <Modal
                size="lg"
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader className="mb-4">
                        <Heading size="lg">Adicionar vídeo</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <VStack className="gap-4">
                            <TextInput
                                placeholder="Digite o título do vídeo"
                                value={title}
                                onChangeText={(text) => {
                                    setValue("title", text);
                                }}
                                error={errors.title?.message}
                            />
                            <VideoPicker
                                setRemoteVideo={(video: string) => {
                                    setValue("content", video);
                                }}
                                placeholder="Selecione o vídeo"
                            />
                            {errors.content?.message && (
                                <Text className="text-red-500 text-sm">
                                    {errors.content?.message}
                                </Text>
                            )}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </View>
    );
}
