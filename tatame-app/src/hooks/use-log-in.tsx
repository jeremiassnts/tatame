import { useCallback, useEffect } from "react";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import { useToast } from "./use-toast";
import z from "zod";

export const loginFormSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(8, "A senha precisa ter no mínimo 8 caracteres"),
});
export type LoginFormType = z.infer<typeof loginFormSchema>;

export function useLogIn() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const { showErrorToast } = useToast();
  const { signIn, setActive, isLoaded } = useSignIn();

  const useWarmUpBrowser = () => {
    useEffect(() => {
      if (Platform.OS !== "android") return;
      void WebBrowser.warmUpAsync();
      return () => {
        // Cleanup: closes browser when component unmounts
        void WebBrowser.coolDownAsync();
      };
    }, []);
  };

  const signInWithEmailAndPassword = async (data: LoginFormType) => {
    if (!isLoaded) return;
    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(logged)/(home)/user-type-selection");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        showErrorToast(
          "Erro ao realizar login!",
          "Não foi possível entrar com suas credenciais, tente novamente."
        );
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      showErrorToast(
        "Erro ao realizar login!",
        "Não foi possível entrar com suas credenciais, tente novamente."
      );
    }
  };

  const signInWithGoogle = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google", 
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            router.replace("/(logged)/(home)/user-type-selection");
          },
        });
      } else {
        showErrorToast(
          "Erro ao realizar login!",
          "Não foi possível entrar com sua conta Google, tente novamente."
        );
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      showErrorToast(
        "Erro ao realizar login!",
        "Não foi possível entrar com sua conta Google, tente novamente."
      );
    }
  }, []);

  const signInWithApple = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_apple",
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            router.replace("/(logged)/(home)/user-type-selection");
          },
        });
      } else {
        showErrorToast(
          "Erro ao realizar login!",
          "Não foi possível entrar com sua conta Apple, tente novamente."
        );
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      showErrorToast(
        "Erro ao realizar login!",
        "Não foi possível entrar com sua conta Apple, tente novamente."
      );
    }
  }, []);

  return {
    useWarmUpBrowser,
    signInWithEmailAndPassword,
    signInWithGoogle,
    signInWithApple,
  };
}
