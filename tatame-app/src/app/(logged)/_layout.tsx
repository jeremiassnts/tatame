import { Box } from "@/src/components/ui/box";
import { CalendarDaysIcon, HomeIcon, Icon } from "@/src/components/ui/icon";
import { COLORS } from "@/src/constants/colors";
import { Tabs, useSegments } from "expo-router";

export default function Layout() {
  const segments = useSegments();
  const pathname = segments[segments.length - 1].replace(/[^a-zA-Z]/g, "");

  return (
    <Tabs
      screenOptions={{
        tabBarBackground: () => <Box className="bg-neutral-900" />,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 5,
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
    </Tabs>
  );
}
