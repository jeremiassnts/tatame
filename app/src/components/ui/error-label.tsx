import { Text } from "react-native";

interface ErrorLabelProps {
  error: string | undefined;
}
export default function ErrorLabel({ error }: ErrorLabelProps) {
  return (
    <Text
      className={`font-sora text-red-500 text-[12px] mt-1 ${
        error ? "" : "hidden"
      }`}
    >
      {error}
    </Text>
  );
}
