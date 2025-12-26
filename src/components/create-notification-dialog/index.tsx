import { useGyms } from "@/src/api/use-gyms";
import { useNotifications } from "@/src/api/use-notifications";
import { useUsers } from "@/src/api/use-users";
import { queryClient } from "@/src/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable } from "react-native";
import z from "zod";
import TextAreaInput from "../text-area-input";
import { TextInput } from "../text-input";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { Box } from "../ui/box";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { Card } from "../ui/card";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "../ui/checkbox";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { AddIcon, CheckIcon } from "../ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalHeader } from "../ui/modal";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const createNotificationFormSchema = z.object({
    title: z.string().min(1, "O título da notificação é obrigatório"),
    content: z.string().min(1, "O conteúdo da notificação é obrigatório"),
    recipients: z.array(z.number()).min(1, "Os destinatários da notificação são obrigatórios"),
});
type CreateNotificationFormType = z.infer<typeof createNotificationFormSchema>;

export default function CreateNotificationDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const { getStudentsByGymId, getUserProfile } = useUsers()
    const { fetchByUser } = useGyms()
    const { create } = useNotifications()
    const { data: gym } = fetchByUser
    const { mutateAsync: createNotification, isPending: isCreatingNotification } = create;
    const { data: userProfile } = getUserProfile;
    const { data: tempStudents, isLoading: isLoadingStudents } = getStudentsByGymId(gym?.id ?? 0)
    const students = tempStudents?.filter((student) => student.id !== userProfile?.id)
    const { setValue, watch, formState: { errors }, handleSubmit, reset } = useForm<CreateNotificationFormType>({
        resolver: zodResolver(createNotificationFormSchema),
        defaultValues: {
            title: "",
            content: "",
            recipients: students?.map((student) => student.id) ?? [],
        },
    });


    const handleOpenModal = () => {
        setIsOpen(true);
    }

    const handleSelectAll = (value: boolean) => {
        if (value) {
            setValue("recipients", students?.map((student) => student.id) ?? []);
        } else {
            setValue("recipients", []);
        }
    }

    const handleSelectStudent = (studentId: number) => {
        if (recipients.includes(studentId)) {
            setValue("recipients", recipients.filter((id) => id !== studentId));

        } else {
            setValue("recipients", [...recipients, studentId]);
        }
    }

    async function handleCreateNotification(data: CreateNotificationFormType) {
        await createNotification({
            title: data.title,
            content: data.content,
            recipients: data.recipients.map((id) => id.toString()),
            channel: "push",
            sent_by: userProfile?.id,
            status: "pending",
            viewed_by: [],
        });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        reset();
        setIsOpen(false);
    }

    const title = watch("title");
    const content = watch("content");
    const recipients = watch("recipients");

    return (
        <Box className="absolute right-5 z-10 bottom-20">
            <Button
                size="md"
                variant="solid"
                className="bg-violet-800 rounded-full w-[50px] h-[50px]"
                onPress={handleOpenModal}
            >
                <ButtonIcon as={AddIcon} color="white" />
            </Button>
            <Modal isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }} size="lg">
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader className="mb-4">
                        <Heading>Criar notificação</Heading>
                    </ModalHeader>
                    <ModalBody>
                        <VStack className="gap-4">
                            <TextInput placeholder="Digite o título da notificação" onChangeText={(text) => {
                                setValue("title", text);
                            }} value={title} error={errors.title?.message} />
                            <TextAreaInput placeholder="Digite o conteúdo da notificação" onChangeText={(text) => {
                                setValue("content", text);
                            }} value={content} error={errors.content?.message} />
                            {isLoadingStudents && <VStack className="bg-neutral-800 rounded-md p-2 gap-2">
                                <Skeleton className="w-full h-[30px] rounded-md bg-neutral-900" />
                                <Skeleton className="w-full h-[30px] rounded-md bg-neutral-900" />
                                <Skeleton className="w-full h-[30px] rounded-md bg-neutral-900" />
                            </VStack>}
                            {
                                !isLoadingStudents && <VStack className="bg-neutral-800 rounded-md p-2 gap-2">
                                    <HStack className="mb-2 mt-2">
                                        <Checkbox isDisabled={false}
                                            isInvalid={false}
                                            size="md"
                                            value="select-all"
                                            defaultIsChecked={true}
                                            onChange={(value) => handleSelectAll(value)}
                                            isChecked={recipients.length === students?.length}
                                        >
                                            <CheckboxIndicator>
                                                <CheckboxIcon as={CheckIcon} />
                                            </CheckboxIndicator>
                                            <CheckboxLabel>Selecionar todos</CheckboxLabel>
                                        </Checkbox>
                                    </HStack>
                                    {students?.map((student) => (
                                        <Pressable key={student.id} onPress={() => handleSelectStudent(student.id)}>
                                            <Card key={student.id} className={`bg-neutral-900 flex-row gap-2 p-3 border-[1px] ${recipients.includes(student.id) ? 'border-neutral-400' : 'border-neutral-900'}`}>
                                                <Avatar size="xs">
                                                    <AvatarFallbackText>{student.name}</AvatarFallbackText>
                                                    <AvatarImage source={{ uri: student.imageUrl }} />
                                                </Avatar>
                                                <Text>{student.name}</Text>
                                            </Card>
                                        </Pressable>
                                    ))}
                                </VStack>
                            }
                            <Button variant="solid" className="bg-violet-800 rounded-md" onPress={handleSubmit(handleCreateNotification)}>
                                <ButtonText className="text-white">Enviar</ButtonText>
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}