import useGraduation from "@/src/api/use-graduation";
import { SelectInput } from "@/src/components/select-input";
import {
    Button,
    ButtonIcon,
    ButtonSpinner,
    ButtonText,
} from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { ArrowLeftIcon, EditIcon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { BELTS } from "@/src/constants/belts";
import { queryClient } from "@/src/lib/react-query";
import { getBeltDegrees } from "@/src/utils/belt";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import z from "zod";

const updateGraduationFormSchema = z.object({
    belt: z.string().min(1, "A faixa é obrigatória"),
    degree: z.number().min(0, "O grau é obrigatório").max(10, "O grau é obrigatório"),
});

type UpdateGraduationParams = {
    id: string;
    belt: string;
    degree: string;
}

export default function UpdateGraduation() {
    const { id, belt, degree } = useLocalSearchParams<UpdateGraduationParams>();
    const router = useRouter();
    const { updateGraduation } = useGraduation();
    const { mutateAsync: updateGraduationFn, isPending: isUpdatingGraduation } = updateGraduation;
    const [degrees, setDegrees] = useState<{ value: string; label: string }[]>(getBeltDegrees(belt));
    const {
        watch,
        setValue,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<z.infer<typeof updateGraduationFormSchema>>({
        resolver: zodResolver(updateGraduationFormSchema),
        defaultValues: {
            belt: belt ?? "",
            degree: degree ? Number(degree) : undefined
        },
    });

    async function handleUpdateGraduation(
        data: z.infer<typeof updateGraduationFormSchema>
    ) {
        updateGraduationFn({
            id: Number(id),
            belt: data.belt,
            degree: data.degree,
        })
            .then(() => {
                reset();
                queryClient.invalidateQueries({ queryKey: ["graduation"] });
                router.replace("/(logged)/(profile)")
            })
    }

    const tempBelt = watch("belt");
    const tempDegree = watch("degree");

    return (
        <SafeAreaView className="p-5">
            <VStack className="items-start gap-6">
                <Button
                    action="secondary"
                    onPress={() => router.back()}
                    className="bg-neutral-800"
                >
                    <ButtonIcon as={ArrowLeftIcon} />
                </Button>
            </VStack>
            <ScrollView>
                <VStack className="pt-10 gap-2">
                    <VStack className="pb-2">
                        <Heading className="text-white" size="xl">
                            Atualização de graduação
                        </Heading>
                        <Text className="text-neutral-400 text-md">
                            Preencha as informações para a atualização da graduação
                        </Text>
                    </VStack>
                    <SelectInput
                        options={BELTS}
                        selectedValue={tempBelt}
                        placeholder="Selecione a faixa"
                        onValueChange={(value) => {
                            setValue("belt", value)
                            const beltDegrees = getBeltDegrees(value)
                            setDegrees(beltDegrees)
                        }}
                        error={errors.belt?.message}
                    />
                    <SelectInput
                        options={degrees}
                        selectedValue={tempDegree?.toString()}
                        placeholder="Selecione o grau"
                        onValueChange={(value) => setValue("degree", Number(value))}
                        disabled={!tempBelt}
                        error={errors.degree?.message}
                    />
                    <Button
                        action="primary"
                        onPress={handleSubmit(handleUpdateGraduation)}
                        className="mt-4 bg-violet-800"
                        disabled={isUpdatingGraduation}
                    >
                        {isUpdatingGraduation && <ButtonSpinner color="white" />}
                        {!isUpdatingGraduation && (
                            <ButtonText className="text-white">Salvar</ButtonText>
                        )}
                        {!isUpdatingGraduation && (
                            <ButtonIcon as={EditIcon} size="md" color="white" />
                        )}
                    </Button>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}
