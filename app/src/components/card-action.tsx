import Icon from "@react-native-vector-icons/feather";
import { TouchableOpacity } from "react-native";
import colors from "tailwindcss/colors";

interface CardActionProps {
  icon: "trash" | "edit" | "x";
  onPress: () => void;
  right: number;
  className?: string;
}

export function CardAction({
  icon,
  onPress,
  right,
  className,
}: CardActionProps) {
  return (
    <TouchableOpacity
      className={`flex justify-center items-center w-[30px] h-[30px] bg-neutral-950 rounded-full absolute top-2 z-10 border-[1px] border-neutral-800 border-solid ${className}`}
      style={{ right }}
    >
      <Icon
        name={icon}
        size={20}
        color={colors.neutral[400]}
        onPress={onPress}
      />
    </TouchableOpacity>
  );
}
