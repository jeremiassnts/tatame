import { useEffect } from "react";
import { Platform } from "react-native";
import z from "zod";
import * as WebBrowser from "expo-web-browser";
import { useSignUp as ClerkSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useToast } from "./use-toast";

export const signUpFormSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha precisa ter no mínimo 8 caracteres"),
  confirmPassword: z
    .string()
    .min(8, "A senha precisa ter no mínimo 8 caracteres"),
});
export type SignUpFormType = z.infer<typeof signUpFormSchema>;

export function useSignUp() {
  const { isLoaded, signUp, setActive } = ClerkSignUp();
  const router = useRouter();
  const { showErrorToast } = useToast();

  const verifyEmail = async (code: string) => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(logged)/(home)/user-type-selection");
      } else {
        showErrorToast(
          "Erro ao verificar email!",
          "Não foi possível verificar o email, tente novamente."
        );
      }
    } catch (err) {
      showErrorToast(
        "Erro ao verificar email!",
        "Não foi possível verificar o email, tente novamente."
      );
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const useWarmUpBrowser = () => {
    useEffect(() => {
      if (Platform.OS !== "android") return;
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }, []);
  };

  const signUpWithEmailAndPassword = async (data: SignUpFormType) => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });
      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err: any) {
      if (err?.errors[0]?.code === "form_identifier_exists") {
        showErrorToast(
          "Erro ao cadastrar!",
          "E-mail já cadastrado, tente outro e-mail."
        );
      } else if (err?.errors[0]?.code === "form_password_pwned") {
        showErrorToast(
          "Erro ao cadastrar!",
          "A senha fornecida foi encontrada em uma violação de dados online. Para a segurança da sua conta, por favor, use uma senha diferente."
        );
      } else {
        showErrorToast(
          "Erro ao cadastrar!",
          "Não foi possível cadastrar, tente novamente."
        );
      }
      console.error(JSON.stringify(err, null, 2));
      throw err;
    }
  };

  return {
    useWarmUpBrowser,
    verifyEmail,
    signUpWithEmailAndPassword,
  };
}
