import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import getUserProfile from "~/src/api/get-user-profile";
import { Skeleton } from "~/src/components/ui/skeleton";
import { env } from "~/src/env";
import { useAuthentication } from "~/src/providers/authentication-provider";

export default function Home() {
  const { getSession, signOut } = useAuthentication();
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { accessToken } = await getSession();
      return getUserProfile(accessToken ?? "");
    },
  });
  const shift = useMemo(() => {
    const now = new Date();
    const shift = now.getHours();
    if (shift < 13) return "BOM DIA";
    if (shift < 18) return "BOA TARDE";
    return "BOA NOITE";
  }, []);

  if (isError) {
    signOut();
  }

  return (
    <SafeAreaView className="flex flex-1 bg-neutral-900 pt-8">
      {isLoading && <Skeleton className="w-full h-[50px]" />}
      {!isLoading && (
        <View className="flex flex-row gap-3 items-center justify-start">
          <View className="flex flex-row justify-start items-center">
            <Image
              source={{
                uri: `${env.EXPO_PUBLIC_R2_URL}${userProfile?.user.profilePhotoUrl}`,
              }}
              className="w-[50px] h-[50px] rounded-full border-neutral-900 border-2 z-10"
            />
            <Image
              source={{
                uri: `${env.EXPO_PUBLIC_R2_URL}${userProfile?.gym.logo}`,
              }}
              className="w-[50px] h-[50px] rounded-full border-neutral-900 border-2 ml-[-20px]"
            />
          </View>
          <View className="flex flex-col align-top justify-center">
            <Text className="font-sora text-white text-[14px]">{shift},</Text>
            <Text className="font-sora-bold text-white text-[18px] uppercase">
              {userProfile?.user.name}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
