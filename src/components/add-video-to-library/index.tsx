import { useAssets } from "@/src/api/assets/use-assets";
import { useAttachments } from "@/src/api/attachments/use-attachments";
import { useToast } from "@/src/hooks/use-toast";
import { queryClient } from "@/src/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import z from "zod";
import { TextInput } from "../text-input";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { AddIcon, CloseIcon, Icon } from "../ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "../ui/modal";
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
    const { watch, setValue, formState: { errors }, handleSubmit, reset, setError } = useForm<AddVideoFormType>({
        resolver: zodResolver(addVideoFormSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    })
    const { createAsset } = useAssets();
    const { uploadVideo } = useAttachments();
    const { mutateAsync: uploadVideoFn } = uploadVideo;
    const { mutateAsync: createAssetFn } = createAsset;
    const [isPending, setIsPending] = useState(false);
    const { showErrorToast } = useToast();

    async function handleUploadVideo(data: AddVideoFormType) {
        setIsPending(true);
        try {
            let videoUrl = null
            for (let i = 0; i < 4; i++) {
                try {
                    videoUrl = await uploadVideoFn(data.content);
                    if (!videoUrl) continue;
                    break;
                } catch (error) {
                    continue;
                }
            }
            if (!videoUrl) {
                showErrorToast("Erro", "Erro ao enviar o vídeo, tentando novamente...");
                return;
            }

            await createAssetFn({
                class_id: null,
                content: videoUrl,
                type: 'video',
                title: data.title,
                valid_until: null,
            });
            setIsOpen(false);
            reset();
            queryClient.invalidateQueries({ queryKey: ["videos"] });
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        }
        setIsPending(false);
    }

    const title = watch("title");
    const content = watch("content");

    return <View>
        <Button
            size="md"
            variant="solid"
            className="bg-violet-800 rounded-full w-[50px] h-[50px] absolute bottom-20 right-5 z-10"
            onPress={() => setIsOpen(true)}
        >
            <ButtonIcon as={AddIcon} color="white" />
        </Button>
        <Modal size="lg" isOpen={isOpen}
            onClose={() => {
                setIsOpen(false);
            }}>
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
                        <TextInput placeholder="Digite o título do vídeo" value={title}
                            onChangeText={(text) => {
                                setValue("title", text);
                            }} error={errors.title?.message} />
                        <VideoPicker setRemoteVideo={(video: string) => {
                            setValue("content", video);
                        }} placeholder="Selecione o vídeo" />
                        {errors.content?.message && <Text className="text-red-500 text-sm">{errors.content?.message}</Text>}
                        <Button onPress={handleSubmit(handleUploadVideo)} isDisabled={isPending}>
                            {isPending && <ButtonSpinner color="white" />}
                            {!isPending && <ButtonIcon as={AddIcon} />}
                            {!isPending && <ButtonText>Adicionar</ButtonText>}
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    </View>
}