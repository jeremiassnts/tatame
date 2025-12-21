import { useAssets } from "@/src/api/use-assets";
import { useAttachments } from "@/src/api/use-attachments";
import { useToast } from "@/src/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { endOfWeek, format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { SelectInput } from "../select-input";
import { TextInput } from "../text-input";
import { Alert, AlertIcon, AlertText } from "../ui/alert";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { AddIcon, CloseIcon, Icon, InfoIcon } from "../ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "../ui/modal";
import { Text } from "../ui/text";
import { Textarea, TextareaInput } from "../ui/textarea";
import { VStack } from "../ui/vstack";
import VideoPicker from "../video-picker";

interface AddContentProps {
    classId: number;
    refetch: () => void;
    classDate: string;
}

const CONTENT_TYPES = [
    {
        value: "video",
        label: "Vídeo",
    },
    {
        value: "text",
        label: "Texto",
    },
]

const addContentFormSchema = z.object({
    type: z.string().min(1, "O tipo de conteúdo é obrigatório"),
    title: z.string().optional(),
    content: z.string().min(1, "O conteúdo é obrigatório"),
});
type AddContentFormType = z.infer<typeof addContentFormSchema>;

export function AddContent({ classId, refetch, classDate }: AddContentProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { watch, setValue, formState: { errors }, handleSubmit, reset, setError } = useForm<AddContentFormType>({
        resolver: zodResolver(addContentFormSchema),
        defaultValues: {
            type: "",
            title: "",
            content: "",
        },
    })
    const { createAsset } = useAssets();
    const { mutateAsync: createAssetFn } = createAsset;
    const [isPending, setIsPending] = useState(false);
    const { uploadVideo } = useAttachments();
    const { mutateAsync: uploadVideoFn } = uploadVideo;
    const { showErrorToast } = useToast();
    const validUntil = endOfWeek(new Date(classDate))

    async function handleAddContent(data: AddContentFormType) {
        if (data.type === 'video' && !data.title) {
            setError("title", { message: "O título é obrigatório" });
            return;
        } else {
            setError("title", { message: "" });
        }
        setIsPending(true);
        try {
            let videoUrl = null
            if (data.type === 'video') {
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
            }

            await createAssetFn({
                class_id: classId,
                content: data.type === 'video' ? videoUrl : data.content,
                type: data.type,
                title: data.type === 'video' ? data.title : null,
                valid_until: format(validUntil, "yyyy-MM-dd"),
            });
            setIsOpen(false);
            reset();
            refetch();
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        }
        setIsPending(false);
    }

    const type = watch("type");
    const content = watch("content");
    const title = watch("title");
    const untilDate = format(validUntil, "dd/MM/yyyy");
    return (
        <VStack>
            <Button onPress={() => setIsOpen(true)}>
                <ButtonIcon as={AddIcon} />
                <ButtonText>Adicionar conteúdo</ButtonText>
            </Button>
            <Modal size="lg" isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader className="mb-4">
                        <Heading size="lg">Adicionar conteúdo</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <VStack className="gap-4">
                            <SelectInput options={CONTENT_TYPES}
                                selectedValue={type}
                                onValueChange={(value) => {
                                    setValue("type", value);
                                }}
                                error={errors.type?.message}
                                placeholder="Selecione o tipo de conteúdo"
                            />
                            {type === "text" && <Textarea className="bg-neutral-800 rounded-md border-0 px-2 text-white">
                                <TextareaInput placeholder="Digite o conteúdo" value={content} onChangeText={(text) => {
                                    setValue("content", text);
                                }} />
                            </Textarea>}
                            {type === 'video' && <TextInput placeholder="Digite o título do vídeo" value={title}
                                onChangeText={(text) => {
                                    setValue("title", text);
                                }} error={errors.title?.message} />}
                            {type === 'video' && <VideoPicker setRemoteVideo={(video: string) => {
                                setValue("content", video);
                            }} placeholder="Selecione o vídeo" />}
                            {errors.content?.message && <Text className="text-red-500 text-sm">{errors.content?.message}</Text>}
                            <Alert action="muted" variant="outline">
                                <AlertIcon as={InfoIcon} />
                                <AlertText className="max-w-[90%]">Este conteúdo será disponibilizado nessa aula até {untilDate}</AlertText>
                            </Alert>
                            <Button onPress={handleSubmit(handleAddContent)} isDisabled={isPending}>
                                {isPending && <ButtonSpinner color="white" />}
                                {!isPending && <ButtonIcon as={AddIcon} />}
                                {!isPending && <ButtonText>Adicionar</ButtonText>}
                            </Button>
                            <Button action="secondary" onPress={reset} isDisabled={isPending}>
                                <ButtonText>Limpar</ButtonText>
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack >
    );
}