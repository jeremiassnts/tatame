import { useRoles } from "@/src/api/use-roles";
import { useUsers } from "@/src/api/use-users";
import { CalendarDaysIcon, HomeIcon, Icon, UserIcon, UsersIcon } from "@/src/components/ui/icon";
import { COLORS } from "@/src/constants/colors";
import { useSegments } from "expo-router";
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  const segments = useSegments();
  const pathname = segments[segments.length - 1].replace(/[^a-zA-Z]/g, "");
  const { getStudentsApprovalStatus } = useUsers();
  const { data: studentsApprovalStatus, isLoading: isLoadingStudentsApprovalStatus } = getStudentsApprovalStatus

  const { getRole } = useRoles()
  const { data: role } = getRole

  const drawerDisplay = !isLoadingStudentsApprovalStatus && studentsApprovalStatus ? "flex" : "none"
  const headerShown = pathname !== "userapprovalcheck"

  return (
    <Drawer screenOptions={{
      headerShown: headerShown,
      headerStyle: {
        backgroundColor: COLORS.background,
        height: 100,
        elevation: 0,
        shadowOpacity: 0,
      },
      drawerType: "slide",
      drawerStyle: {
        backgroundColor: COLORS.black,
        display: drawerDisplay
      },
      headerTintColor: COLORS.active,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: COLORS.active,
        fontSize: 13,
        backgroundColor: '#404040',
        textTransform: 'uppercase',
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 2,
        paddingBottom: 2,
        fontWeight: 'normal',
      },
      drawerActiveBackgroundColor: '#262626',
      drawerInactiveBackgroundColor: 'transparent',
      drawerItemStyle: {
        borderRadius: 4,
      },
      drawerContentContainerStyle: {
        gap: 5,
      },
      drawerActiveTintColor: COLORS.active,
      drawerInactiveTintColor: COLORS.inactive,
    }}>
      <Drawer.Screen name="(home)" options={{
        drawerLabel: "Home",
        title: "Home",
        drawerIcon: () => (
          <Icon
            as={HomeIcon}
            size="md"
            color={pathname === "home" ? COLORS.active : COLORS.inactive}
          />
        ),
      }} />
      <Drawer.Screen name="(schedule)" options={{
        drawerLabel: "Agenda",
        title: "Agenda",
        drawerIcon: () => (
          <Icon
            as={CalendarDaysIcon}
            size="md"
            color={pathname === "schedule" ? COLORS.active : COLORS.inactive}
          />
        ),
      }} />
      <Drawer.Screen name="(users)" options={{
        drawerItemStyle: {
          display: role === "MANAGER" ? "flex" : "none"
        },
        drawerLabel: "Alunos",
        title: "Alunos",
        drawerIcon: () => (
          <Icon
            as={UsersIcon}
            size="md"
            color={pathname === "users" ? COLORS.active : COLORS.inactive}
          />
        ),
      }} />
      <Drawer.Screen name="(profile)" options={{
        drawerLabel: "Perfil",
        title: "Perfil",
        drawerIcon: () => (
          <Icon
            as={UserIcon}
            size="md"
            color={pathname === "profile" ? COLORS.active : COLORS.inactive}
          />
        ),
      }} />
    </Drawer>
  );
}
