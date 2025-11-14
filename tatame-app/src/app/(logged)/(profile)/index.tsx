import { useUsers } from "@/src/api/use-users";
import { GraduationCard } from "@/src/components/graduation-card";
import { SignOutButton } from "@/src/components/sign-out-button";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import { HStack } from "@/src/components/ui/hstack";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { getUserProfile } = useUsers();
  const { data: userProfile, isLoading } = getUserProfile;
  const router = useRouter();

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
          <GraduationCard showBelt={true} />
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
