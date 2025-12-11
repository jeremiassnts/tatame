import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "./ui/image";
import { VStack } from "./ui/vstack";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";
import { TextInput } from "./text-input";
import { useSignUp } from "../hooks/use-sign-up";
import { useState } from "react";
import { Button, ButtonSpinner, ButtonText } from "./ui/button";

export default function EmailVerification() {
  const [code, setCode] = useState("");
  const { verifyEmail } = useSignUp();
  const [isVerifying, setIsVerifying] = useState(false);

  async function handleVerifyEmail() {
    setIsVerifying(true);
    try {
      await verifyEmail(code);
    } catch (error) {
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <SafeAreaView className="flex flex-1 items-center justify-center pl-5 pr-5">
      <Image
        source={{
          uri: require("@/assets/images/logo.png"),
        }}
        alt="logo"
        className="w-[170px]"
        resizeMode="contain"
      />
      <VStack className="mt-4 mb-4">
        <Heading size="2xl" className="text-center">
          Verificação de e-mail
        </Heading>
        <Text className="text-neutral-500 text-md text-center mb-8">
          Verifique seu e-mail e preencha o código de verificação enviado
        </Text>
        <TextInput
          value={code}
          placeholder="Digite o código de verificação"
          onChangeText={(code) => setCode(code)}
          onSubmitEditing={() => verifyEmail(code)}
          returnKeyType="send"
          keyboardType="numeric"
          className="text-3xl font-bold text-center"
        />
        <Button
          className="mt-4 bg-violet-700"
          size="xl"
          onPress={handleVerifyEmail}
        >
          {isVerifying && <ButtonSpinner color="white" />}
          <ButtonText className="text-white">
            {isVerifying ? "Verificando..." : "Verificar"}
          </ButtonText>
        </Button>
      </VStack>
    </SafeAreaView>
  );
}
