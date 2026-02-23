import { useUpdateUserImage } from "@/src/api/attachments/update-user-image";
import { useListLastMonthCheckins } from "@/src/api/checkins/list-last-month-checkins";
import { useIsHigherRole } from "@/src/api/roles/is-higher-role";
import { useIsLowerRole } from "@/src/api/roles/is-lower-role";
import { useListStudentsApprovalStatus } from "@/src/api/users/list-students-approval-status";
import { AccountSection } from "@/src/components/account-section";
import { GraduationCard } from "@/src/components/graduation-card";
import { PersonalDataSection } from "@/src/components/personal-data-section";
import { ProfileGymCard } from "@/src/components/profile-gym-card";
import { ProfilePlan } from "@/src/components/profile-plan";
import { StudentPresenceSection } from "@/src/components/student-presence-section";
import AvatarWithDialog from "@/src/components/ui/avatar/avatar-with-dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const isHigherRole = useIsHigherRole();
  const isLowerRole = useIsLowerRole();
  const { mutateAsync: updateUserImageAsync } = useUpdateUserImage();
  const { user, gym, isLoading } = useProfileContext();

  const { data: studentsApprovalStatus } = useListStudentsApprovalStatus();
  const { data: lastMonthCheckins } = useListLastMonthCheckins(user?.id ?? 0);

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
      {!isLoading && user && (
        <ScrollView>
          <VStack className="items-center justify-center pl-5 pr-5 mb-10">
            <AvatarWithDialog
              fullName={user?.fullName ?? ""}
              imageUrl={user?.profilePicture ?? ""}
              size="xl"
              updateImageFn={async (image) => {
                await updateUserImageAsync({
                  image,
                  userId: user.clerkUserId,
                });
              }}
            />
            <Text className="text-white text-lg font-bold mt-3">
              {user?.fullName ?? ""}
            </Text>
            <Text className="text-neutral-400 text-md">{user?.email}</Text>
            <GraduationCard showBelt={true} />
            <PersonalDataSection
              firstName={user?.firstName ?? ""}
              lastName={user?.lastName ?? ""}
            />
            {isHigherRole() && <ProfilePlan />}
            {lastMonthCheckins && studentsApprovalStatus && isLowerRole() && (
              <StudentPresenceSection checkins={lastMonthCheckins} />
            )}
            {studentsApprovalStatus && <ProfileGymCard gym={gym} />}
            <AccountSection />
          </VStack>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
