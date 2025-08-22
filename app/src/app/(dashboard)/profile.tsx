import Icon from "@react-native-vector-icons/feather";
import { useQuery } from "@tanstack/react-query";
import { useColorScheme } from "nativewind";
import { Image, SafeAreaView, Text, View } from "react-native";
import getUserProfile from "~/src/api/get-user-profile";
import { env } from "~/src/env";
import { useAuthentication } from "~/src/providers/authentication-provider";
import colors from "tailwindcss/colors";
import InfoRow from "~/src/components/info-row";
import { format } from "date-fns";
import { Button } from "~/src/components/ui/button";
import { Dialog, DialogTrigger } from "~/src/components/ui/dialog";
import ActionDialog from "~/src/components/ui/action-dialog";

export default function Profile() {
  const { getSession, signOut } = useAuthentication();
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { accessToken } = await getSession();
      return getUserProfile(accessToken ?? "");
    },
  });
  function handleSignOut() {
    signOut();
  }

  return (
    <SafeAreaView className="flex flex-1 bg-neutral-900 pt-8 items-center justify-start">
      <Image
        source={{
          uri: `${env.EXPO_PUBLIC_R2_URL}${userProfile?.user.profilePhotoUrl}`,
        }}
        className="w-[80px] h-[80px] rounded-full"
      />
      <Text className="font-sora-bold text-white text-[18px] mt-2">
        {userProfile?.user.name}
      </Text>
      <View className="w-full p-3 mt-4 bg-neutral-800 rounded-sm flex flex-col gap-2">
        <Text className="font-sora-bold text-[16px] text-white mb-2">
          Informações
        </Text>
        <InfoRow
          icon="mail"
          label="Email"
          value={userProfile?.user.email ?? ""}
        />
        <InfoRow
          icon="user"
          label="Gênero"
          value={userProfile?.user.gender === "male" ? "Masculino" : "Feminino"}
        />
        <InfoRow
          icon="calendar"
          label="Data de nascimento"
          value={format(new Date(userProfile?.user.birth ?? ""), "dd/MM/yyyy")}
        />
      </View>
      <Dialog>
        <ActionDialog
          title="Encerrar sessão"
          description="Tem certeza que deseja encerrar a sessão?"
          onConfirm={handleSignOut}
        />
        <DialogTrigger asChild>
          <Button className="w-[200px] mt-4 bg-neutral-700">
            <Text className="text-white text-[14px] font-sora">
              Encerrar sessão
            </Text>
          </Button>
        </DialogTrigger>
      </Dialog>
    </SafeAreaView>
  );
}
