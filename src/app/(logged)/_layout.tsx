import { useRoles } from "@/src/api/use-roles";
import { useUsers } from "@/src/api/use-users";
import { Box } from "@/src/components/ui/box";
import { CalendarDaysIcon, HomeIcon, Icon, UserIcon, UsersIcon } from "@/src/components/ui/icon";
import { COLORS } from "@/src/constants/colors";
import { Tabs, useSegments } from "expo-router";

export default function Layout() {
  const segments = useSegments();
  const pathname = segments[segments.length - 1].replace(/[^a-zA-Z]/g, "");
  const { getStudentsApprovalStatus } = useUsers();
  const { data: studentsApprovalStatus, isLoading: isLoadingStudentsApprovalStatus } = getStudentsApprovalStatus

  const { getRole } = useRoles()
  const { data: role } = getRole

  return (
    <Tabs
      screenOptions={{
        tabBarBackground: () => <Box className="bg-neutral-900" />,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 5,
          display: !isLoadingStudentsApprovalStatus && studentsApprovalStatus ? "flex" : "none",
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: () => (
            <Icon
              as={HomeIcon}
              size="md"
              color={pathname === "home" ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(schedule)"
        options={{
          title: "Agenda",
          tabBarIcon: () => (
            <Icon
              as={CalendarDaysIcon}
              size="md"
              color={pathname === "schedule" ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(users)"
        options={{
          href: role === "MANAGER" ? "/(logged)/(users)" : null,
          title: "Alunos",
          tabBarIcon: () => (
            <Icon
              as={UsersIcon}
              size="md"
              color={pathname === "users" ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Perfil",
          tabBarIcon: () => (
            <Icon
              as={UserIcon}
              size="md"
              color={pathname === "profile" ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />
    </Tabs >
  );
}
