import { useAssets } from "@/src/api/use-assets";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { SelectInput } from "../select-input";
import { Alert, AlertIcon, AlertText } from "../ui/alert";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { AddIcon, CloseIcon, Icon, InfoIcon } from "../ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "../ui/modal";
import { Text } from "../ui/text";
import { Textarea, TextareaInput } from "../ui/textarea";
import { VStack } from "../ui/vstack";

interface AddContentProps {
    classId: number;
    refetch: () => void;
}

const CONTENT_TYPES = [
    // {
    //     value: "video",
    //     label: "Vídeo",
    // },
    {
        value: "text",
        label: "Texto",
    },
]

const addContentFormSchema = z.object({
    type: z.string().min(1, "O tipo de conteúdo é obrigatório"),
    content: z.string().min(1, "O conteúdo é obrigatório"),
});
type AddContentFormType = z.infer<typeof addContentFormSchema>;

export function AddContent({ classId, refetch }: AddContentProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { watch, setValue, formState: { errors }, handleSubmit, reset } = useForm<AddContentFormType>({
        resolver: zodResolver(addContentFormSchema),
        defaultValues: {
            type: "",
            content: "",
        },
    })
    const { createAsset } = useAssets();
    const { mutateAsync: createAssetFn, isPending } = createAsset;

    async function handleAddContent(data: AddContentFormType) {
        await createAssetFn({
            class_id: classId,
            content: data.content,
            type: data.type,
            valid_until: addDays(new Date(), 7).toISOString(),
        });
        setIsOpen(false);
        reset();
        refetch();
    }

    const type = watch("type");
    const content = watch("content");
    const untilDate = format(addDays(new Date(), 7), "dd/MM/yyyy");

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
                            <Textarea className="bg-neutral-800 rounded-md border-0 px-2 text-white">
                                <TextareaInput placeholder="Digite o conteúdo" value={content} onChangeText={(text) => {
                                    setValue("content", text);
                                }} />
                            </Textarea>
                            {errors.content?.message && <Text className="text-red-500 text-sm">{errors.content?.message}</Text>}
                            <Alert action="muted" variant="outline">
                                <AlertIcon as={InfoIcon} />
                                <AlertText>Este conteúdo será disponibilizado até {untilDate}</AlertText>
                            </Alert>
                            <Button onPress={handleSubmit(handleAddContent)} isDisabled={isPending}>
                                {isPending && <ButtonSpinner color="white" />}
                                {!isPending && <ButtonIcon as={AddIcon} />}
                                {!isPending && <ButtonText>Adicionar</ButtonText>}
                            </Button>
                            <Button action="secondary" onPress={reset}>
                                <ButtonText>Limpar</ButtonText>
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack >
    );
}