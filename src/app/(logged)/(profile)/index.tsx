import { useAttachments } from "@/src/api/use-attachments";
import { useUsers } from "@/src/api/use-users";
import { GraduationCard } from "@/src/components/graduation-card";
import { ProfileGymCard } from "@/src/components/profile-gym-card";
import { SignOutButton } from "@/src/components/sign-out-button";
import AvatarWithDialog from "@/src/components/ui/avatar/avatar-with-dialog";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import { HStack } from "@/src/components/ui/hstack";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { getUserProfile } = useUsers();
  const { data: userProfile, isLoading } = getUserProfile;
  const { updateUserImage } = useAttachments();
  const { user } = useUser();

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
          <AvatarWithDialog fullName={userProfile.fullName}
            imageUrl={user?.imageUrl ?? ""}
            size="xl"
            updateImageFn={async (image) => {
              await updateUserImage.mutateAsync({ image, userId: userProfile.clerk_user_id });
            }}
          />
          <Text className="text-white text-lg font-bold mt-3">
            {userProfile.fullName}
          </Text>
          <Text className="text-neutral-400 text-md">
            {userProfile.emailAddresses?.[0]?.emailAddress}
          </Text>
          <GraduationCard showBelt={true} />
          <ProfileGymCard gym={userProfile.gym?.data} />
        </VStack>
      )}
    </SafeAreaView>
  );
}
