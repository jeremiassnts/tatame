import { useToast } from "@/src/hooks/use-toast";
import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const router = useRouter();
  const { showErrorToast } = useToast();

  const handleSignOut = async () => {
    try {
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
    <TouchableOpacity onPress={handleSignOut} className="bg-red-500 p-2 rounded-md">
      <Text>Sign out</Text>
    </TouchableOpacity>
  );
};
