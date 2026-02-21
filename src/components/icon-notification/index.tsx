import { listUnreadNotifications } from "@/src/api/notifications/list-unread-notifications";
import { Box } from "@/src/components/ui/box";
import { Icon } from "@/src/components/ui/icon";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { ElementType } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Text } from "../ui/text";

interface IconNotificationProps {
    icon: ElementType<any> | undefined;
    showAmount?: boolean;
    size: "sm" | "md" | "lg" | "xl";
    color: string;
    style?: StyleProp<ViewStyle>;
}

export function IconNotification({
    icon,
    showAmount,
    size,
    color,
    style,
}: IconNotificationProps) {
    const navigation = useNavigation();
    const { data: unreadNotifications } = listUnreadNotifications();
    const amount =
        unreadNotifications && unreadNotifications?.length > 9
            ? "9+"
            : unreadNotifications?.length;

    return (
        <Pressable
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={style}
        >
            <Icon as={icon} size={size} color={color} />
            {unreadNotifications &&
                unreadNotifications?.length > 0 &&
                !showAmount && (
                    <Box className="bg-red-500 rounded-full w-3 h-3 absolute top-0 right-[-2px]" />
                )}
            {unreadNotifications && unreadNotifications?.length > 0 && showAmount && (
                <Box className="bg-red-500 rounded-full w-4 h-4 absolute top-[-4px] right-[-4px] flex items-center justify-center p-0">
                    <Text className="text-white font-bold text-xs">{amount}</Text>
                </Box>
            )}
        </Pressable>
    );
}
