import EmailVerification from "@/src/components/email-verification";
import { TextInput } from "@/src/components/text-input";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/src/components/ui/button";
import { Divider } from "@/src/components/ui/divider";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { AppleIcon, GoogleIcon } from "@/src/components/ui/icon";
import { Image } from "@/src/components/ui/image";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useLogIn } from "@/src/hooks/use-log-in";
import {
  signUpFormSchema,
  SignUpFormType,
  useSignUp,
} from "@/src/hooks/use-sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSigningUpWithGoogle, setIsSigningUpWithGoogle] = useState(false);
  const [isSigningUpWithApple, setIsSigningUpWithApple] = useState(false);
  const {
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    register,
    setFocus,
    reset,
    setError,
  } = useForm<SignUpFormType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });
  const { useWarmUpBrowser, signUpWithEmailAndPassword } =
    useSignUp();
  const { signInWithSSO } = useLogIn();

  const handleSignInWithGoogle = async () => {
    try {
      setIsSigningUpWithGoogle(true);
      await signInWithSSO("oauth_google");
    } finally {
      setIsSigningUpWithGoogle(false);
    }
  };

  const handleSignInWithApple = async () => {
    try {
      setIsSigningUpWithApple(true);
      await signInWithSSO("oauth_apple");
    } finally {
      setIsSigningUpWithApple(false);
    }
  };

  const handleSignInWithEmailAndPassword = async (data: SignUpFormType) => {
    try {
      if (data.password !== data.confirmPassword) {
        setError("confirmPassword", { message: "As senhas não coincidem" });
        return;
      }
      setError("confirmPassword", { message: "" });
      setIsSigningUp(true);
      await signUpWithEmailAndPassword(data);
      setPendingVerification(true);
      reset();
    } finally {
      setIsSigningUp(false);
    }
  };

  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const firstName = watch("firstName");
  const lastName = watch("lastName");

  useWarmUpBrowser();

  if (pendingVerification) {
    return <EmailVerification />;
  }

  return (
    <ScrollView>
      <SafeAreaView className="flex flex-1 items-center justify-center pl-5 pr-5 pb-4">
        <Image
          source={{
            uri: require("@/assets/images/logo.png"),
          }}
          alt="logo"
          className="w-[170px]"
          resizeMode="contain"
        />
        <VStack className="pl-5 pr-5 mt-4 mb-4">
          <Heading size="2xl" className="text-center">
            Cadastro
          </Heading>
          <Text className="text-neutral-500 text-md text-center">
            Preencha seus dados para criar sua conta
          </Text>
        </VStack>
        <VStack className="w-full gap-3">
          <TextInput
            value={firstName}
            onChangeText={(text) => {
              setValue("firstName", text);
            }}
            placeholder="Digite seu nome"
            label="Nome"
            error={errors.firstName?.message}
            {...register("firstName")}
            onSubmitEditing={() => setFocus("lastName", { shouldSelect: true })}
            returnKeyType="next"
          />
          <TextInput
            value={lastName}
            onChangeText={(text) => {
              setValue("lastName", text);
            }}
            placeholder="Digite seu sobrenome"
            label="Sobrenome"
            error={errors.lastName?.message}
            {...register("lastName")}
            onSubmitEditing={() => setFocus("email", { shouldSelect: true })}
            returnKeyType="next"
          />
          <TextInput
            value={email}
            onChangeText={(text) => {
              setValue("email", text);
            }}
            placeholder="Digite seu email"
            label="Email"
            error={errors.email?.message}
            {...register("email")}
            onSubmitEditing={() => setFocus("password", { shouldSelect: true })}
            returnKeyType="next"
          />
          <TextInput
            value={password}
            onChangeText={(text) => {
              setValue("password", text);
            }}
            placeholder="Digite sua senha"
            label="Senha"
            isPassword={true}
            error={errors.password?.message}
            {...register("password")}
            onSubmitEditing={() =>
              setFocus("confirmPassword", { shouldSelect: true })
            }
            returnKeyType="next"
          />
          <TextInput
            value={confirmPassword}
            onChangeText={(text) => {
              setValue("confirmPassword", text);
            }}
            placeholder="Digite sua senha"
            label="Confirmar senha"
            isPassword={true}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
            onSubmitEditing={handleSubmit(handleSignInWithEmailAndPassword)}
            returnKeyType="send"
          />
          <Button
            className="mt-2 bg-violet-700"
            size="xl"
            onPress={handleSubmit(handleSignInWithEmailAndPassword)}
          >
            {isSigningUp && <ButtonSpinner color="white" />}
            <ButtonText className="text-white">
              {isSigningUp ? "Cadastrando..." : "Cadastrar"}
            </ButtonText>
          </Button>
        </VStack>
        <HStack className="w-full items-center justify-center gap-2 mt-4 mb-4">
          <Divider className="bg-neutral-700" />
          <Text className="text-neutral-500 text-md">ou</Text>
          <Divider className="bg-neutral-700" />
        </HStack>
        <VStack className="w-full">
          <Button
            className="h-14 rounded-md"
            size="md"
            onPress={handleSignInWithGoogle}
          >
            {isSigningUpWithGoogle && <ButtonSpinner color="white" />}
            <ButtonIcon as={GoogleIcon} size="md" />
            <ButtonText className="text-neutral-900">
              {isSigningUpWithGoogle
                ? "Cadastrando..."
                : "Cadastrar com google"}
            </ButtonText>
          </Button>
          <Button
            className="mt-4 h-14 rounded-md"
            onPress={handleSignInWithApple}
          >
            {isSigningUpWithApple && <ButtonSpinner color="white" />}
            <ButtonIcon as={AppleIcon} size="md" />
            <ButtonText className="text-neutral-900">
              {isSigningUpWithApple ? "Cadastrando..." : "Cadastrar com apple"}
            </ButtonText>
          </Button>
          <Text className="text-neutral-400 text-md text-center mt-4">
            Já possui uma conta?{" "}
            <Link href="/sign-in" className="text-violet-500 font-bold">
              Faça login
            </Link>
          </Text>
        </VStack>
      </SafeAreaView>
    </ScrollView>
  );
}
