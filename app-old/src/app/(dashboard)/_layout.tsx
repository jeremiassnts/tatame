import Icon from "@react-native-vector-icons/feather";
import { Tabs, usePathname, useSegments } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function DashboardLayout() {
  const segments = useSegments();
  const pathname = segments[segments.length - 1].replace(/[^a-zA-Z]/g, "");
  const routes = ["home", "profile", "schedule"];
  return (
    <SafeAreaView className="flex flex-1 bg-neutral-900 pt-10 pl-4 pr-4">
      {routes.includes(pathname) && (
        <View className="flex flex-row items-center justify-between pt-4">
          <Text className="font-sora text-[14px] text-neutral-400 bg-neutral-800 pb-1 pl-4 pr-4 rounded-full capitalize">
            {pathname == "home"
              ? "Início"
              : pathname == "profile"
              ? "Perfil"
              : pathname == "schedule"
              ? "Agenda"
              : ""}
          </Text>
        </View>
      )}
      <Tabs
        screenOptions={{
          tabBarBackground: () => <View className="bg-neutral-900" />,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            paddingTop: 5,
          },
        }}
        initialRouteName="home"
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: () => (
              <Icon
                name="home"
                size={24}
                color={pathname === "home" ? "#ffffff" : "#6C6C6C"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: () => (
              <Icon
                name="user"
                size={24}
                color={pathname === "profile" ? "#ffffff" : "#6C6C6C"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(schedule)"
          initialParams={{ pathname: "schedule", screen: "index" }}
          options={{
            title: "Agenda",
            href: "/(dashboard)/(schedule)",
            tabBarIcon: () => (
              <Icon
                name="calendar"
                size={24}
                color={pathname === "schedule" ? "#ffffff" : "#6C6C6C"}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
