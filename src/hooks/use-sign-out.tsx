import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useToast } from "./use-toast";
import { useUserTypeCache } from "./use-user-type-cache";

export function useSignOut() {
    const { signOut } = useClerk();
    const router = useRouter();
    const { showErrorToast } = useToast();
    const { clearUserType } = useUserTypeCache();

    const signOutFn = async () => {
        try {
            await clearUserType();
            await signOut();
            router.replace("/(auth)/sign-in");
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
            showErrorToast(
                "Erro ao realizar logout!",
                "Não foi possível sair da conta, tente novamente."
            );
        }
    };

    return {
        signOut: signOutFn,
    }
}