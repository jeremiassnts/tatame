import { Box } from "@/src/components/ui/box";
import { HomeIcon, Icon } from "@/src/components/ui/icon";
import { Tabs } from "expo-router";

export default function Layout() {
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
          tabBarIcon: () => <Icon as={HomeIcon} size="md" color="white" />,
        }}
      />
    </Tabs>
  );
}
