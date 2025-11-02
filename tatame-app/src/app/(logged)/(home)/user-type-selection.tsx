import { useUsers } from "@/src/api/use-users";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Heading } from "@/src/components/ui/heading";
import { Icon, UserIcon } from "@/src/components/ui/icon";
import { Image } from "@/src/components/ui/image";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { USER_TYPES, UserType } from "@/src/constants/user-type";
import { useUserTypeCache } from "@/src/hooks/use-user-type-cache";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ImageBackground, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { getUserType, setUserType } = useUserTypeCache();
  const [isUserTypeLoaded, setIsUserTypeLoaded] = useState(false);
  const router = useRouter();
  const { getUserByClerkUserId, createUser } = useUsers();
  const { userId } = useAuth();
  const [tempUserType, setTempUserType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleContinue() {
    if (!tempUserType) return;

    setIsLoading(true);
    await createUser({
      clerkUserId: userId ?? "",
      role: tempUserType as UserType,
    });
    setUserType(tempUserType as UserType);
    setIsLoading(false);
    router.replace("/(logged)/(home)");
  }

  useEffect(() => {
    const fetchUserType = async () => {
      const userType = await getUserType();
      if (!userType) {
        const user = await getUserByClerkUserId(userId ?? "");
        if (user && user.role) {
          setUserType(user.role as UserType);
          router.replace("/(logged)/(home)");
        } else {
          setIsUserTypeLoaded(true);
        }
      } else {
        router.replace("/(logged)/(home)");
      }
    };
    fetchUserType();
  }, []);

  if (!isUserTypeLoaded) {
    return (
      <ImageBackground
        source={require("@/assets/images/splash.png")}
        className="flex-1"
      />
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ImageBackground
        source={require("@/assets/images/home-bg.png")}
        className="flex-1 pl-10 pr-10"
        resizeMode="cover"
      >
        <Box className="flex-1 bg-neutral-900 absolute top-0 left-0 right-0 bottom-0 opacity-50" />
        <VStack className="items-center justify-center mt-[40%] pl-10 pr-10">
          <Text className="font-medium text-neutral-400 text-lg">
            Bem vindo ao
          </Text>
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[230px] mt-[-10px] mb-[-5px]"
            resizeMode="contain"
            alt="Tatame Logo"
          />
          <Text className="text-neutral-400 text-md text-center">
            Selecione o tipo de acesso abaixo e comece já a usar a plataforma
          </Text>
        </VStack>
        <VStack className="gap-4 mt-10">
          {Object.values(USER_TYPES).map((user_type) => (
            <Pressable
              key={user_type.label}
              onPress={() => setTempUserType(user_type.value as UserType)}
            >
              <Card
                size="lg"
                variant="elevated"
                className={`flex flex-row items-center gap-4 border-[1px] ${
                  tempUserType === user_type.value
                    ? "border-violet-800"
                    : "border-neutral-900"
                }`}
              >
                <Box className="bg-violet-800 p-2 rounded-full">
                  <Icon color="white" as={UserIcon} size="xl" />
                </Box>
                <VStack className="flex-1">
                  <Heading size="lg">{user_type.label}</Heading>
                  <Text className="text-md text-neutral-400">
                    {user_type.description}
                  </Text>
                </VStack>
              </Card>
            </Pressable>
          ))}
        </VStack>
        <Button
          size="lg"
          variant="solid"
          className="w-full bg-violet-800 disabled:opacity-50 mt-5"
          onPress={handleContinue}
          disabled={isLoading || !tempUserType}
        >
          {isLoading ? (
            <ButtonSpinner color="white" />
          ) : (
            <ButtonText className="text-white">Continuar</ButtonText>
          )}
        </Button>
      </ImageBackground>
    </SafeAreaView>
  );
}
