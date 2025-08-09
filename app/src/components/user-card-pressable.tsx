import { Pressable, Text, View } from "react-native";
import Icon from "@react-native-vector-icons/feather";

interface UserCardPressableProps {
  title: string;
  description: string;
  active: boolean;
  onPress: () => void;
  icon: "user" | "book" | "briefcase";
}
export default function UserCardPressable({
  title,
  description,
  active,
  onPress,
  icon,
}: UserCardPressableProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`p-4 pl-10 pr-10 flex flex-row gap-3 items-center w-full justify-center bg-neutral-900 rounded-xl border-[1px] ${
        active ? "border-violet-800" : "border-neutral-800"
      }`}
    >
      <View className="flex items-center justify-center bg-violet-800 rounded-full w-[36px] h-[36px]">
        <Icon name={icon} color={"#ffffff"} size={20} />
      </View>
      <View className="flex flex-col gap-0 leading-none">
        <Text className="text-[18px] text-white font-sora-bold">{title}</Text>
        <Text className="text-[14px] text-neutral-400 font-sora">
          {description}
        </Text>
      </View>
    </Pressable>
  );
}
