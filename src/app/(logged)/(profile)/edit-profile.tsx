import { useUpdateUser } from "@/src/api/users/update-user";
import DateTimePicker from "@/src/components/date-time-picker";
import IosDateTimePicker from "@/src/components/ios-date-time-picker";
import { SelectInput } from "@/src/components/select-input";
import { TextInput } from "@/src/components/text-input";
import {
    Button,
    ButtonIcon,
    ButtonSpinner,
    ButtonText,
} from "@/src/components/ui/button";
import { HStack } from "@/src/components/ui/hstack";
import { AtSignIcon, EditIcon } from "@/src/components/ui/icon";
import { VStack } from "@/src/components/ui/vstack";
import { GENDERS } from "@/src/constants/genders";
import { queryClient } from "@/src/lib/react-query";
import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

type EditProfileParams = {
    id: string;
    firstName: string;
    lastName: string;
    instagram: string;
    phone: string;
    gender: string;
    birth: string;
};
const editProfileFormSchema = z.object({
    firstName: z.string().min(1, "O nome é obrigatório"),
    lastName: z.string().min(1, "O sobrenome é obrigatório"),
    instagram: z.string().optional(),
    phone: z.string().optional(),
    gender: z.string().optional(),
    birth: z.string().optional(),
});
type EditProfileFormType = z.infer<typeof editProfileFormSchema>;

export default function EditProfile() {
    const { user } = useUser();
    const router = useRouter();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const { mutateAsync: editUser } = useUpdateUser();
    const { id, firstName, lastName, instagram, phone, gender, birth } =
        useLocalSearchParams<EditProfileParams>();
    const {
        watch,
        setValue,
        formState: { errors },
        handleSubmit,
        reset,
        register,
        setFocus,
    } = useForm<EditProfileFormType>({
        resolver: zodResolver(editProfileFormSchema),
        defaultValues: {
            firstName: firstName ?? "",
            lastName: lastName ?? "",
            instagram: instagram ?? "",
            phone: phone ?? "",
            gender: gender ?? "",
            birth: birth ?? "",
        },
    });

    function formatBirthDay(birth: string | undefined) {
        if (!birth) return null;
        const [date] = birth.split("T");
        const [_, month, day] = date.split("-");
        return `${month}-${day}`;
    }

    async function handleEditProfile(data: EditProfileFormType) {
        try {
            setIsEditingProfile(true);
            await user?.update({
                firstName: data.firstName,
                lastName: data.lastName,
            });

            await editUser({
                id: Number(id),
                instagram: !!data.instagram ? data.instagram.replace("@", "") : null,
                phone: !!data.phone ? data.phone : null,
                gender: !!data.gender ? data.gender : null,
                birth: !!data.birth ? data.birth : null,
                birth_day: formatBirthDay(data.birth),
                firstName: data.firstName,
                lastName: data.lastName,
            });
            setIsEditingProfile(false);
            reset();
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            router.navigate("/(logged)/(profile)");
        } catch {
            setIsEditingProfile(false);
        }
    }

    function formatBirth(birth: string) {
        if (!birth) return undefined;
        const birthDate = new Date(birth);
        return new Date(
            birthDate.valueOf() + birthDate.getTimezoneOffset() * 60 * 1000,
        );
    }

    return (
        <SafeAreaView className="pl-5 pr-5">
            <ScrollView>
                <VStack className="gap-2">
                    <TextInput
                        value={watch("firstName")}
                        onChangeText={(text) => {
                            setValue("firstName", text);
                        }}
                        placeholder="Digite seu primeiro nome"
                        label="Primeiro nome"
                        error={errors.firstName?.message}
                        {...register("firstName")}
                        returnKeyType="next"
                        onSubmitEditing={() => setFocus("lastName", { shouldSelect: true })}
                    />
                    <TextInput
                        value={watch("lastName")}
                        onChangeText={(text) => {
                            setValue("lastName", text);
                        }}
                        placeholder="Digite seu sobrenome"
                        label="Sobrenome"
                        error={errors.lastName?.message}
                        {...register("lastName")}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                            setFocus("instagram", { shouldSelect: true })
                        }
                    />
                    <TextInput
                        icon={AtSignIcon}
                        value={watch("instagram")}
                        onChangeText={(text) => {
                            setValue("instagram", text);
                        }}
                        placeholder="Digite seu Instagram"
                        label="Instagram"
                        error={errors.instagram?.message}
                        {...register("instagram")}
                        onSubmitEditing={() => setFocus("phone", { shouldSelect: true })}
                        returnKeyType="next"
                        autoCapitalize="none"
                    />
                    <TextInput
                        value={watch("phone")}
                        onChangeText={(text) => {
                            setValue("phone", text);
                        }}
                        placeholder="Digite seu telefone"
                        label="Telefone"
                        error={errors.phone?.message}
                        {...register("phone")}
                        onSubmitEditing={() => setFocus("gender", { shouldSelect: true })}
                        returnKeyType="next"
                        keyboardType="numeric"
                    />
                    <SelectInput
                        options={GENDERS.map((gender) => ({
                            label: gender.label,
                            value: gender.value,
                        }))}
                        placeholder="Selecione o gênero"
                        error={errors.gender?.message}
                        onValueChange={(value) => setValue("gender", value)}
                        selectedValue={watch("gender")}
                        label="Gênero"
                    />

                    {Platform.OS === "ios" ? (
                        <IosDateTimePicker
                            value={formatBirth(birth)}
                            setNewDate={(date: Date | undefined) => {
                                if (date) {
                                    setValue("birth", date.toISOString());
                                }
                            }}
                            placeholder="Selecione a data de nascimento"
                            error={errors?.birth?.message}
                            label="Data de nascimento"
                        />
                    ) : (
                        <DateTimePicker
                            value={formatBirth(birth)}
                            setNewDate={(date: Date | undefined) => {
                                if (date) {
                                    setValue("birth", date.toISOString());
                                }
                            }}
                            placeholder="Selecione a data de nascimento"
                            error={errors?.birth?.message}
                            label="Data de nascimento"
                        />
                    )}
                    <HStack className="gap-2 w-full items-center justify-center mt-4">
                        <Button
                            action="secondary"
                            onPress={() => router.navigate("/(logged)/(profile)")}
                            className="bg-neutral-800"
                            disabled={isEditingProfile}
                        >
                            <ButtonText>Cancelar</ButtonText>
                        </Button>
                        <Button
                            action="primary"
                            onPress={handleSubmit(handleEditProfile)}
                            className="bg-violet-800"
                            disabled={isEditingProfile}
                        >
                            {isEditingProfile && <ButtonSpinner color="white" />}
                            {!isEditingProfile && (
                                <ButtonText className="text-white">Salvar</ButtonText>
                            )}
                            {!isEditingProfile && (
                                <ButtonIcon as={EditIcon} size="md" color="white" />
                            )}
                        </Button>
                    </HStack>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}
