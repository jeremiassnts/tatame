import { useToast } from "@/src/hooks/use-toast";
import { useUserTypeCache } from "@/src/hooks/use-user-type-cache";
import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Button, ButtonText } from "../ui/button";

interface SignOutButtonProps {
  className?: string;
}

export const SignOutButton = ({ className }: SignOutButtonProps) => {
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
      variant="outline"
      size="md"
      action="negative"
      onPress={handleSignOut}
      className={className}
    >
      <ButtonText className="text-error-500">Encerrar sessão</ButtonText>
    </Button>
  );
};
