import { Link } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "@/src/components/ui/image";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { TextInput } from "@/src/components/text-input";
import { VStack } from "@/src/components/ui/vstack";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/src/components/ui/button";
import { HStack } from "@/src/components/ui/hstack";
import { Divider } from "@/src/components/ui/divider";
import { AppleIcon, GoogleIcon } from "@/src/components/ui/icon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as WebBrowser from "expo-web-browser";
import {
  signUpFormSchema,
  SignUpFormType,
  useSignUp,
} from "@/src/hooks/use-sign-up";
import { useLogIn } from "@/src/hooks/use-log-in";
import EmailVerification from "@/src/components/email-verification";

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
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
    },
  });
  const { useWarmUpBrowser, signUpWithEmailAndPassword, verifyEmail } =
    useSignUp();
  const { signInWithGoogle, signInWithApple } = useLogIn();

  const handleSignInWithGoogle = async () => {
    try {
      setIsSigningUpWithGoogle(true);
      await signInWithGoogle();
    } finally {
      setIsSigningUpWithGoogle(false);
    }
  };

  const handleSignInWithApple = async () => {
    try {
      setIsSigningUpWithApple(true);
      await signInWithApple();
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

  useWarmUpBrowser();

  if (pendingVerification) {
    return <EmailVerification />;
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
            {isSigningUpWithGoogle ? "Cadastrando..." : "Cadastrar com google"}
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
  );
}
