import useGraduation from "@/src/api/use-graduation";
import { useUsers } from "@/src/api/use-users";
import { SignOutButton } from "@/src/components/sign-out-button";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { AddIcon } from "@/src/components/ui/icon";
import { Image } from "@/src/components/ui/image";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { BELT_COLORS } from "@/src/constants/belts";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { getUserProfile } = useUsers();
  const { data: userProfile, isLoading } = getUserProfile;
  const { getGraduation } = useGraduation();
  const { data: graduation, isLoading: isLoadingGraduation } = getGraduation;
  const router = useRouter();

  // @ts-ignore
  const beltColor = graduation ? BELT_COLORS[graduation?.belt] : "#FFFFFF";

  return (
    <SafeAreaView>
      <HStack className="justify-between items-center p-5">
        <Badge size="lg" variant="solid" action="muted" className="rounded-sm">
          <BadgeText>Perfil</BadgeText>
        </Badge>
        <SignOutButton />
      </HStack>
      {isLoading && (
        <VStack className="gap-4 items-start justify-start p-5">
          <Skeleton className="w-[80px] h-[80px] rounded-full bg-neutral-800" />
          <Skeleton className="w-full h-[40px] rounded-md bg-neutral-800" />
          <Skeleton className="w-full mb-6 h-[20px] rounded-md bg-neutral-800" />
          <Skeleton className="w-full h-[60px] rounded-md bg-neutral-800" />
          <Skeleton className="w-full h-[60px] rounded-md bg-neutral-800" />
          <Skeleton className="w-full h-[60px] rounded-md bg-neutral-800" />
        </VStack>
      )}
      {!isLoading && userProfile && (
        <VStack className="items-center justify-center pt-8 pl-5 pr-5">
          <Avatar size="xl">
            <AvatarFallbackText>{userProfile.fullName}</AvatarFallbackText>
            <AvatarImage source={{ uri: userProfile.imageUrl }} />
          </Avatar>
          <Text className="text-white text-lg font-bold mt-3">
            {userProfile.fullName}
          </Text>
          <Text className="text-neutral-400 text-md">
            {userProfile.emailAddresses?.[0]?.emailAddress}
          </Text>
          <Skeleton
            isLoaded={!isLoadingGraduation}
            className="w-full h-[70px] bg-neutral-800 rounded-md mt-4"
          ></Skeleton>
          {!isLoadingGraduation && !graduation && (
            <Box className="w-full bg-neutral-800 rounded-md h-[70px] items-center justify-center mt-4">
              <Button
                onPress={() =>
                  router.push("/(logged)/(profile)/create-graduation")
                }
              >
                <ButtonIcon as={AddIcon} />
                <ButtonText>Cadastrar graduação</ButtonText>
              </Button>
            </Box>
          )}
          {!isLoadingGraduation && graduation && (
            <HStack className="w-[200px] h-[20px] border-[1px] border-neutral-800 rounded-sm mt-2">
              <Box className="flex-1" style={{ backgroundColor: beltColor }} />
              <HStack className={`w-[25%] justify-evenly ${graduation.belt === 'black' ? 'bg-red-800' : 'bg-neutral-900'}`} >
                {Array.from({ length: graduation.degree ?? 0 }).map((_, index) => (
                  <Box key={index} className="w-[4px] h-full bg-white"/>
                ))}
                </HStack>
              <Box className="w-[5%]" style={{ backgroundColor: beltColor }} />
            </HStack>
          )}
          <HStack className="bg-neutral-800 w-full p-5 rounded-md gap-4 items-center justify-center mt-4">
            <Avatar size="lg">
              <AvatarFallbackText>
                {userProfile.gym.data?.name}
              </AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: `${process.env.EXPO_PUBLIC_R2_URL}${userProfile.gym.data?.logo}`,
                }}
              />
            </Avatar>
            <VStack className="justify-center items-start">
              <Text className="text-white text-lg font-bold">
                {userProfile.gym.data?.name}
              </Text>
              <Text className="text-neutral-400 text-md">
                {userProfile.gym.data?.address}
              </Text>
            </VStack>
          </HStack>
          {/* <VStack className="p-5 w-full justify-start items-start">
            <Heading size="md">Academia</Heading>
            <HStack>
              <Text></Text>
            </HStack>
          </VStack> */}
          {/* <Box>
          <Image source={{ uri: `${process.env.EXPO_PUBLIC_R2_URL}${userProfile.gym.data?.logo}` }} alt="Gym Logo" />
            <Text>{userProfile.gym.data?.name}</Text>
          </Box> */}
          {/* <Box className="w-full items-start justify-center p-5 z-10">
            <Avatar size="xl">
              <AvatarFallbackText>{userProfile.fullName}</AvatarFallbackText>
              <AvatarImage source={{ uri: userProfile.imageUrl }} />
            </Avatar>
          </Box>
          <VStack className="bg-neutral-800 w-full p-5 rounded-t-[15px] mt-[-4.5rem] z-0 pt-[4.5rem] h-full">
            <VStack>
              <Text className="text-white text-lg font-bold">
                {userProfile.fullName}
              </Text>
              <Text className="text-neutral-400 text-md">
                {userProfile.emailAddresses?.[0]?.emailAddress}
              </Text>
            </VStack>
            {userProfile.gym.data && (
              <Box className="bg-neutral-700 w-full p-5 rounded-md">
                <Image source={{ uri: `${process.env.EXPO_PUBLIC_R2_URL}${userProfile.gym.data.logo}` }} alt="Gym Logo" />
                <VStack>
                  <Text>{userProfile.gym.data.name}</Text>
                </VStack>
              </Box>
            )}
          </VStack> */}
        </VStack>
      )}
    </SafeAreaView>
  );
}
