import { useAttachments } from "@/src/api/use-attachments";
import { useCheckins } from "@/src/api/use-checkins";
import { useRoles } from "@/src/api/use-roles";
import { useUsers } from "@/src/api/use-users";
import { GraduationCard } from "@/src/components/graduation-card";
import { ProfileGymCard } from "@/src/components/profile-gym-card";
import { SignOutButton } from "@/src/components/sign-out-button";
import { StudentPresenceSection } from "@/src/components/student-presence-section";
import AvatarWithDialog from "@/src/components/ui/avatar/avatar-with-dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useUser } from "@clerk/clerk-expo";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { getUserProfile, getStudentsApprovalStatus } = useUsers();
  const { updateUserImage } = useAttachments();
  const { user } = useUser();
  const { fetchLastMonthCheckins } = useCheckins();
  const { getRole } = useRoles();

  const { data: studentsApprovalStatus } = getStudentsApprovalStatus
  const { data: userProfile, isLoading } = getUserProfile;
  const { data: lastMonthCheckins } = fetchLastMonthCheckins;
  const { data: role } = getRole;

  return (
    <SafeAreaView>
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
        <ScrollView>
          <VStack className="items-center justify-center pl-5 pr-5 mb-10">
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
            {lastMonthCheckins && studentsApprovalStatus && role == "STUDENT" && <StudentPresenceSection checkins={lastMonthCheckins} />}
            {studentsApprovalStatus && <ProfileGymCard gym={userProfile.gym} />}
            <SignOutButton className="mt-4" />
          </VStack>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
