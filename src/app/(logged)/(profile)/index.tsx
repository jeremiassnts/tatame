import { useAttachments } from "@/src/api/use-attachments";
import { useCheckins } from "@/src/api/use-checkins";
import { useRoles } from "@/src/api/use-roles";
import { useUsers } from "@/src/api/use-users";
import { AccountSection } from "@/src/components/account-section";
import { GraduationCard } from "@/src/components/graduation-card";
import { PersonalDataSection } from "@/src/components/personal-data-section";
import { ProfileGymCard } from "@/src/components/profile-gym-card";
import { StudentPresenceSection } from "@/src/components/student-presence-section";
import AvatarWithDialog from "@/src/components/ui/avatar/avatar-with-dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { getStudentsApprovalStatus } = useUsers();
  const { updateUserImage } = useAttachments();
  const { fetchLastMonthCheckins } = useCheckins();
  const { isLowerRole } = useRoles();
  const { user, gym, isLoading } = useProfileContext();

  const { data: studentsApprovalStatus } = getStudentsApprovalStatus;
  const { data: lastMonthCheckins } = fetchLastMonthCheckins;

  const fullName = (user?.first_name + " " + (user?.last_name ?? "")).trim();

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
              fullName={fullName}
              imageUrl={user?.profile_picture ?? ""}
              size="xl"
              updateImageFn={async (image) => {
                await updateUserImage.mutateAsync({
                  image,
                  userId: user.clerk_user_id,
                });
              }}
            />
            <Text className="text-white text-lg font-bold mt-3">
              {fullName}
            </Text>
            <Text className="text-neutral-400 text-md">{user?.email}</Text>
            <GraduationCard showBelt={true} />
            <PersonalDataSection
              user={user}
              firstName={user?.first_name ?? ""}
              lastName={user?.last_name ?? ""}
            />
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
