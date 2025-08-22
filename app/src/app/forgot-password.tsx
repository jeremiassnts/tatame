import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import requestChangePassword from "../api/change-password";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useRouter } from "expo-router";
import Icon from "@react-native-vector-icons/feather";

export default function ForgotPassword() {
  const router = useRouter();
  const { mutate: requestChangePasswordFn, isPending } = useMutation({
    mutationFn: requestChangePassword,
    onSuccess: () => {
      Alert.alert("E-mail enviado", "Verifique sua caixa de e-mail");
    },
    onError: () => {},
  });

  function handleGoBack() {
    router.back();
  }
  return (
    <SafeAreaView className="flex flex-1 bg-neutral-900 pt-10 pl-6 pr-6">
      <Button
        onPress={handleGoBack}
        size={"icon"}
        className="rounded-full w-[36px] h-[36px] bg-neutral-800 flex items-center justify-center"
      >
        <Icon name="arrow-left" color={"#ffffff"} size={20} />
      </Button>
      <View className="pt-4">
        <Text className="font-sora-bold text-white text-[20px]">
          Esqueci a senha
        </Text>
        <Text className="font-sora text-neutral-400 text-[14px]">
          Digite seu e-mail para receber um link de recuperação
        </Text>
      </View>
      <View className="w-full pl-1 pr-1 flex flex-col gap-2 mt-5">
        <View>
          <Input
            className="font-sora text-[14px] bg-neutral-800"
            placeholder="Digite seu e-mail"
          />
        </View>
        <Button
          onPress={() => requestChangePasswordFn({ email: "teste@teste.com" })}
          disabled={isPending}
        >
          <Text className="font-sora-bold text-[14px]">
            {isPending ? "Enviando..." : "Enviar"}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
