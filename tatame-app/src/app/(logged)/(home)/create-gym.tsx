import { useAttachments } from "@/src/api/use-attachments";
import { useGyms } from "@/src/api/use-gyms";
import { useUsers } from "@/src/api/use-users";
import DateTimePicker from "@/src/components/date-time-picker";
import ImageViewer from "@/src/components/image-picker";
import { TextInput } from "@/src/components/text-input";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { AddIcon, ArrowLeftIcon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useToast } from "@/src/hooks/use-toast";
import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import z from "zod";

const createGymFormSchema = z.object({
  name: z.string().min(1, "O nome da academia é obrigatório"),
  address: z.object({
    cep: z.string().min(1, "O CEP é obrigatório"),
    street: z.string().min(1, "A rua é obrigatória"),
    number: z.string().min(1, "O número é obrigatório"),
    neighborhood: z.string().min(1, "O bairro é obrigatório"),
    city: z.string().min(1, "A cidade é obrigatória"),
    state: z.string().min(1, "O estado é obrigatório"),
  }),
  since: z.date({ error: "A data de criação da academia é obrigatória" }),
  logo: z.string().min(1, "A logo da academia é obrigatória"),
});

export default function CreateGym() {
  const router = useRouter();
  const { createGym } = useGyms();
  const [isCreatingGym, setIsCreatingGym] = useState(false);
  const { getUserByClerkUserId } = useUsers();
  const { user } = useUser();
  const { uploadImage } = useAttachments();
  const { showErrorToast } = useToast();
  const {
    watch,
    setValue,
    register,
    setFocus,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<z.infer<typeof createGymFormSchema>>({
    resolver: zodResolver(createGymFormSchema),
    defaultValues: {
      name: "",
      address: {
        street: "",
        cep: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
      },
      since: new Date(),
      logo: "",
    },
  });

  async function uploadLogo(logo: string) {
    const imageUrl = await uploadImage(logo);
    return imageUrl;
  }

  async function handleCreateGym(data: z.infer<typeof createGymFormSchema>) {
    if (!user?.id) return;
    setIsCreatingGym(true);
    //tries to upload the logo 4 times
    let imageUrl: string | undefined;
    for (let i = 0; i < 4; i++) {
      try {
        imageUrl = await uploadLogo(data.logo);
        if (!imageUrl) continue;
        data.logo = imageUrl;
        break;
      } catch {
        continue;
      }
    }
    if (!imageUrl) {
      showErrorToast("Erro", "Erro ao enviar a logo da academia");
      setIsCreatingGym(false);
      return;
    }
    const sp_user = await getUserByClerkUserId(user.id);
    createGym({
      name: data.name,
      address: `${data.address.street}, ${data.address.number} - ${data.address.neighborhood}, ${data.address.city} - ${data.address.state}`,
      managerId: sp_user?.id,
      since: data.since.toISOString(),
      logo: imageUrl,
    })
      .then(() => {
        setIsCreatingGym(false);
        reset();
        router.replace("/(logged)/(home)");
      })
      .catch(() => {
        setIsCreatingGym(false);
      });
  }

  const name = watch("name");
  const address = watch("address");

  return (
    <SafeAreaView className="p-10">
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
          <ImageViewer
            placeholder="Adicionar logo"
            setRemoteImage={(image: string) => {
              setValue("logo", image);
            }}
            error={errors?.logo?.message}
          />
          <VStack className="pt-5 pb-2">
            <Heading className="text-white" size="xl">
              Cadastro de academia
            </Heading>
            <Text className="text-neutral-400 text-md">
              Preencha as informações para o cadastro da academia
            </Text>
          </VStack>
          <TextInput
            value={name}
            onChangeText={(text) => {
              setValue("name", text);
            }}
            placeholder="Digite o nome da academia"
            error={errors.name?.message}
            {...register("name")}
            onSubmitEditing={() => setFocus("address", { shouldSelect: true })}
            returnKeyType="next"
          />
          <DateTimePicker
            setNewDate={(date: Date | undefined) => {
              if (date) {
                setValue("since", date);
              }
            }}
            placeholder="Data de criação"
            error={errors?.since?.message}
          />
          <VStack className="pt-2 gap-2">
            <Text className="text-white text-md font-medium">Endereço</Text>
            <TextInput
              value={address.cep}
              onChangeText={(text) => {
                setValue("address.cep", text);
              }}
              placeholder="Digite o CEP"
              error={errors.address?.cep?.message}
              {...register("address.cep")}
              onSubmitEditing={() =>
                setFocus("address.street", { shouldSelect: true })
              }
              returnKeyType="next"
              keyboardType="numeric"
            />
            <TextInput
              value={address.street}
              onChangeText={(text) => {
                setValue("address.street", text);
              }}
              placeholder="Digite a rua"
              error={errors.address?.street?.message}
              {...register("address.street")}
              onSubmitEditing={() =>
                setFocus("address.number", { shouldSelect: true })
              }
              returnKeyType="next"
            />
            <TextInput
              value={address.number}
              onChangeText={(text) => {
                setValue("address.number", text);
              }}
              placeholder="Digite o número"
              error={errors.address?.number?.message}
              {...register("address.number")}
              onSubmitEditing={() =>
                setFocus("address.neighborhood", { shouldSelect: true })
              }
              returnKeyType="next"
              keyboardType="numeric"
            />
            <TextInput
              value={address.neighborhood}
              onChangeText={(text) => {
                setValue("address.neighborhood", text);
              }}
              placeholder="Digite o bairro"
              error={errors.address?.neighborhood?.message}
              {...register("address.neighborhood")}
              onSubmitEditing={() =>
                setFocus("address.city", { shouldSelect: true })
              }
              returnKeyType="next"
            />
            <TextInput
              value={address.city}
              onChangeText={(text) => {
                setValue("address.city", text);
              }}
              placeholder="Digite a cidade"
              error={errors.address?.city?.message}
              {...register("address.city")}
              onSubmitEditing={() =>
                setFocus("address.city", { shouldSelect: true })
              }
              returnKeyType="next"
            />
            <TextInput
              value={address.state}
              onChangeText={(text) => {
                setValue("address.state", text);
              }}
              placeholder="Digite o estado"
              error={errors.address?.state?.message}
              {...register("address.city")}
              returnKeyType="send"
              onSubmitEditing={handleSubmit(handleCreateGym)}
            />
          </VStack>
          <Button
            action="primary"
            onPress={handleSubmit(handleCreateGym)}
            className="mt-4 bg-violet-800"
            disabled={isCreatingGym}
          >
            {isCreatingGym && <ButtonSpinner color="white" />}
            {!isCreatingGym && (
              <ButtonText className="text-white">Cadastrar</ButtonText>
            )}
            {!isCreatingGym && (
              <ButtonIcon as={AddIcon} size="md" color="white" />
            )}
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
