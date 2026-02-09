import { useRoles } from "@/src/api/use-roles";
import { useUsers } from "@/src/api/use-users";
import { IconNotification } from "@/src/components/icon-notification";
import {
  CalendarDaysIcon,
  GlobeIcon,
  HomeIcon,
  Icon,
  MenuIcon,
  PlayIcon,
  UserIcon,
  UsersIcon,
} from "@/src/components/ui/icon";
import { COLORS } from "@/src/constants/colors";
import { useSendNotification } from "@/src/hooks/use-send-notification";
import { queryClient } from "@/src/lib/react-query";
import { useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { BellIcon } from "lucide-react-native";
import { useEffect } from "react";

export default function Layout() {
  const segments = useSegments();
  const pathname = segments[segments.length - 1].replace(/[^a-zA-Z]/g, "");
  const { getStudentsApprovalStatus, getUserProfile, migrateUser } = useUsers();
  const { mutateAsync: migrateUserFn } = migrateUser;
  const { data: studentsApprovalStatus } = getStudentsApprovalStatus;
  const { initializePushNotifications } = useSendNotification();
  const { isHigherRole } = useRoles();
  const { data: userProfile } = getUserProfile;

  const isApproved = isHigherRole() || studentsApprovalStatus;

  async function checkUserMigration() {
    if (userProfile?.migrated_at) return;
    await migrateUserFn();
    queryClient.invalidateQueries({ queryKey: ["user-profile"] });
  }

  useEffect(() => {
    if (userProfile) {
      initializePushNotifications(userProfile?.id);
      checkUserMigration();
    }
  }, [userProfile]);

  const headerShown =
    (userProfile?.role === "MANAGER" && !!userProfile?.plan) ||
    userProfile?.role !== "MANAGER";

  return (
    <Drawer
      screenOptions={{
        headerShown: headerShown,
        headerLeft: () => (
          <IconNotification
            showAmount
            icon={MenuIcon}
            size="xl"
            color="white"
            style={{ marginLeft: 15 }}
          />
        ),
        headerStyle: {
          backgroundColor: COLORS.background,
          height: 100,
          elevation: 0,
          shadowOpacity: 0,
        },
        drawerType: "slide",
        drawerStyle: {
          backgroundColor: COLORS.black,
        },
        headerTintColor: COLORS.active,
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: COLORS.active,
          fontSize: 13,
          backgroundColor: "#404040",
          textTransform: "uppercase",
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 2,
          paddingBottom: 2,
          fontWeight: "normal",
        },
        drawerActiveBackgroundColor: "#262626",
        drawerInactiveBackgroundColor: "transparent",
        drawerItemStyle: {
          borderRadius: 4,
        },
        drawerContentContainerStyle: {
          gap: 5,
        },
        drawerActiveTintColor: COLORS.active,
        drawerInactiveTintColor: COLORS.inactive,
      }}
    >
      <Drawer.Screen
        name="(home)"
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: () => (
            <Icon
              as={HomeIcon}
              size="md"
              color={pathname === "home" ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="(schedule)"
        options={{
          drawerLabel: "Agenda",
          title: "Agenda",
          drawerItemStyle: {
            display: isApproved ? "flex" : "none",
          },
          drawerIcon: () => (
            <Icon
              as={CalendarDaysIcon}
              size="md"
              color={pathname === "schedule" ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="(users)"
        options={{
          drawerItemStyle: {
            display: isHigherRole() ? "flex" : "none",
          },
          drawerLabel: "Usuários",
          title: "Usuários",
          drawerIcon: () => (
            <Icon
              as={UsersIcon}
              size="md"
              color={pathname === "users" ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="(gym)"
        options={{
          drawerLabel: "Academia",
          drawerItemStyle: {
            display: isApproved ? "flex" : "none",
          },
          title: "Academia",
          drawerIcon: () => (
            <Icon
              as={GlobeIcon}
              size="md"
              color={pathname === "gym" ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="(library)"
        options={{
          drawerLabel: "Biblioteca",
          title: "Biblioteca",
          drawerItemStyle: {
            display: "none", //isApproved ? "flex" : "none",
          },
          drawerIcon: () => (
            <Icon
              as={PlayIcon}
              size="md"
              color={pathname === "library" ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="(notifications)"
        options={{
          drawerLabel: "Notificações",
          title: "Notificações",
          drawerItemStyle: {
            display: isApproved ? "flex" : "none",
          },
          drawerIcon: () => (
            <IconNotification
              icon={BellIcon}
              size="md"
              color={
                pathname === "notifications" ? COLORS.active : COLORS.inactive
              }
              showAmount
            />
          ),
        }}
      />
      <Drawer.Screen
        name="(profile)"
        options={{
          drawerLabel: "Perfil",
          title: "Perfil",
          drawerIcon: () => (
            <Icon
              as={UserIcon}
              size="md"
              color={pathname === "profile" ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />
    </Drawer>
  );
}
