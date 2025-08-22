import Icon from "@react-native-vector-icons/feather";
import { Text, View } from "react-native";
import colors from "tailwindcss/colors";

interface InfoRowProps {
  icon: any;
  label: string;
  value: string;
}

export default function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-[5px] justify-start">
        <Icon name={icon} size={14} color={colors.neutral[400]} />
        <Text className="text-[14px] text-neutral-400 font-sora">{label}</Text>
      </View>
      <Text className="text-white text-[14px] font-sora">{value}</Text>
    </View>
  );
}
