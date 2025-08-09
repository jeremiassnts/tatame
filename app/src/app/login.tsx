import { Alert, Image, Pressable, Text, View } from "react-native";
import { Badge } from "~/src/components/ui/badge";
import { UserType } from "../constants/user-type";
import TextInput from "../components/ui/text-input";
import { Button } from "../components/ui/button";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import authenticate from "../api/authenticate";
import { useMutation } from "@tanstack/react-query";
import { useUserType } from "../providers/user-type-provider";
import { useSignUpContext } from "../providers/sign-up-provider";
import { useAuthentication } from "../providers/authentication-provider";

const loginFormSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});
type LoginFormType = z.infer<typeof loginFormSchema>;

export default function Login() {
  const { userType, selectUserType } = useUserType();
  const { handleUpdateStepsCount, handleUpdateUserType } = useSignUpContext();
  const { signIn } = useAuthentication();
  const {
    watch,
    formState: { errors },
    setValue,
    register,
    handleSubmit,
    setFocus,
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutate: authenticateFn, isPending: isAuthenticating } = useMutation({
    mutationFn: authenticate,
    onSuccess: (data) => {
      signIn(data.accessToken, new Date(data.expiresIn));
      router.replace("/(dashboard)/home");
    },
    onError: () => {
      Alert.alert("Erro ao fazer login", "E-mail ou senha inválidos");
    },
  });
  const router = useRouter();

  function handleUserTypeChange(user: UserType) {
    selectUserType(user);
  }

  function handleSignup() {
    if (!userType) return;
    handleUpdateUserType(userType);
    switch (userType) {
      case UserType.MANAGER:
        handleUpdateStepsCount(4);
        router.navigate("/(sign-up)/gym-creation");
        break;
      case UserType.INSTRUCTOR:
      case UserType.STUDENT:
        handleUpdateStepsCount(3);
        router.navigate("/(sign-up)/user-creation");
        break;
      default:
        break;
    }
  }

  async function handleLogin(data: LoginFormType) {
    authenticateFn({
      email: data.email,
      password: data.password,
    });
  }

  const email = watch("email");
  const password = watch("password");

  return (
    <View className="flex items-center justify-start bg-neutral-900 flex-1 pt-[30%]">
      <Image
        source={require("~/assets/images/tatame-logo.png")}
        className="w-[170px]"
        resizeMode="contain"
      />
      <Badge className="pl-2.5 pr-2.5 bg-neutral-700 border-0 mt-2">
        <Text className="font-sora text-white text-[12px]">
          {userType === UserType.STUDENT
            ? "Aluno"
            : userType === UserType.INSTRUCTOR
            ? "Professor"
            : "Gestor"}
        </Text>
      </Badge>
      <Text className="font-sora text-white text-[20px] mt-1">Login</Text>
      <Text className="font-sora text-neutral-400 text-[14px] w-[230px] text-center">
        Preencha seus dados e acesse a plataforma
      </Text>
      <View className="w-full pl-6 pr-6 flex flex-col gap-2 mt-7">
        <TextInput
          label="Email"
          name="email"
          placeholder="Digite seu e-mail"
          value={email}
          error={errors?.email?.message}
          onChangeText={(text: string) => setValue("email", text)}
          onSubmitEditing={() => setFocus("password")}
          returnKeyType="next"
          register={register("email")}
        />
        <TextInput
          label="Senha"
          name="password"
          placeholder="Digite sua senha"
          value={password}
          error={errors?.password?.message}
          onChangeText={(text: string) => setValue("password", text)}
          onSubmitEditing={handleSubmit(handleLogin)}
          returnKeyType="send"
          register={register("password")}
          secureTextEntry={true}
        />
        <Pressable onPress={() => router.navigate("/forgot-password")}>
          <Text className="text-violet-500 font-sora text-[14px] text-right">
            Esqueci a senha
          </Text>
        </Pressable>
        <Button
          size={"lg"}
          className="w-full bg-violet-800 border-[1px] disabled:bg-transparent disabled:border-stone-700 mt-7"
          disabled={!email || !password || isAuthenticating}
          onPress={handleSubmit(handleLogin)}
        >
          <Text className="text-[18px] text-white text-center font-sora-bold">
            Entrar
          </Text>
        </Button>
      </View>
      <View className="flex items-center justify-start gap-2 mt-7">
        <View className="flex items-center justify-center flex-row">
          <Text className="text-neutral-400 font-sora text-[14px]">
            Ainda não tem uma conta?{" "}
          </Text>
          <Pressable onPress={handleSignup}>
            <Text className="text-violet-500 font-sora text-[14px]">
              Cadastre-se
            </Text>
          </Pressable>
        </View>
        {userType != "student" && (
          <Pressable onPress={() => handleUserTypeChange(UserType.STUDENT)}>
            <Text className="text-violet-500 font-sora text-[14px]">
              Entrar como aluno
            </Text>
          </Pressable>
        )}
        {userType != "instructor" && (
          <Pressable onPress={() => handleUserTypeChange(UserType.INSTRUCTOR)}>
            <Text className="text-violet-500 font-sora text-[14px]">
              Entrar como professor
            </Text>
          </Pressable>
        )}
        {userType != "manager" && (
          <Pressable onPress={() => handleUserTypeChange(UserType.MANAGER)}>
            <Text className="text-violet-500 font-sora text-[14px]">
              Entrar como gestor
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
