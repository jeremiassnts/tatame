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
import { GoogleIcon } from "@/src/components/ui/icon";
import { Image } from "@/src/components/ui/image";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Redirect } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  loginFormSchema,
  LoginFormType,
  useLogIn,
} from "@/src/hooks/use-log-in";
import { useAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Redirect href={"/(logged)/(home)/user-type-selection"} />;
  }
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);
  // const [isSigningInWithApple, setIsSigningInWithApple] = useState(false);
  const {
    useWarmUpBrowser,
    signInWithSSO,
    signInWithEmailAndPassword,

  } = useLogIn();
  const {
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    register,
    setFocus,
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignInWithGoogle = async () => {
    try {
      setIsSigningInWithGoogle(true);
      await signInWithSSO("oauth_google");
    } finally {
      setIsSigningInWithGoogle(false);
    }
  };

  // const handleSignInWithApple = async () => {
  //   try {
  //     setIsSigningInWithApple(true);
  //     await signInWithSSO("oauth_apple");
  //   } finally {
  //     setIsSigningInWithApple(false);
  //   }
  // };

  const handleSignInWithEmailAndPassword = async (data: LoginFormType) => {
    try {
      setIsSigningIn(true);
      await signInWithEmailAndPassword(data);
    } finally {
      setIsSigningIn(false);
    }
  };

  const email = watch("email");
  const password = watch("password");

  useWarmUpBrowser();

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
      <VStack className="pl-5 pr-5 mt-4 mb-8">
        <Heading size="2xl" className="text-center">
          Login
        </Heading>
        <Text className="text-neutral-500 text-md text-center">
          Preencha seus dados para acessar sua conta
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
          onSubmitEditing={handleSubmit(handleSignInWithEmailAndPassword)}
          returnKeyType="send"
        />
        <Button
          className="mt-2 bg-violet-700"
          size="xl"
          onPress={handleSubmit(handleSignInWithEmailAndPassword)}
        >
          {isSigningIn && <ButtonSpinner color="white" />}
          <ButtonText className="text-white">
            {isSigningIn ? "Entrando..." : "Entrar"}
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
          {isSigningInWithGoogle && <ButtonSpinner color="white" />}
          <ButtonIcon as={GoogleIcon} size="md" />
          <ButtonText className="text-neutral-900">
            {isSigningInWithGoogle ? "Entrando..." : "Entrar com google"}
          </ButtonText>
        </Button>
        {/* <Button
          className="mt-4 h-14 rounded-md"
          onPress={handleSignInWithApple}
        >
          {isSigningInWithApple && <ButtonSpinner color="white" />}
          <ButtonIcon as={AppleIcon} size="md" />
          <ButtonText className="text-neutral-900">
            {isSigningInWithApple ? "Entrando..." : "Entrar com apple"}
          </ButtonText>
        </Button> */}
        <Text className="text-neutral-400 text-md text-center mt-4">
          Ainda não tem uma conta?{" "}
          <Link href="/sign-up" className="text-violet-500 font-bold">
            Cadastre-se
          </Link>
        </Text>
      </VStack>
    </SafeAreaView>
  );
}
