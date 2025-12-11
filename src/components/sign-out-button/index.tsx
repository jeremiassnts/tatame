import { useToast } from "@/src/hooks/use-toast";
import { useUserTypeCache } from "@/src/hooks/use-user-type-cache";
import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { ExternalLinkIcon } from "../ui/icon";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const router = useRouter();
  const { showErrorToast } = useToast();
  const { clearUserType } = useUserTypeCache();

  const handleSignOut = async () => {
    try {
      await clearUserType();
      await signOut();
      // Redirect to your desired page
      router.replace("/(auth)/sign-in");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      showErrorToast(
        "Erro ao realizar logout!",
        "Não foi possível sair da conta, tente novamente."
      );
    }
  };

  return (
    <Button
      variant="link"
      size="md"
      action="negative"
      onPress={handleSignOut}
    >
      <ButtonText className="text-error-500">Encerrar sessão</ButtonText>
    </Button>
  );
};
