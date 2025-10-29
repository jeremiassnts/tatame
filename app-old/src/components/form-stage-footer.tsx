import { Text, View } from "react-native";
import StepVisualizer from "./ui/step-visualizer";
import { Button } from "./ui/button";
import Icon from "@react-native-vector-icons/feather";

interface FormStageFooterProps {
  stageCount: number;
  stage: number;
  handleSubmit: () => void;
  label?: string;
  enabled?: boolean;
}

export default function FormStageFooter({
  stage,
  stageCount,
  handleSubmit,
  label,
  enabled = true,
}: FormStageFooterProps) {
  return (
    <View className="flex flex-row justify-between items-center fixed bottom-16">
      <StepVisualizer count={stageCount} current={stage} />
      <View className="flex flex-row gap-2 items-center justify-end">
        <Button
          size={!label ? "icon" : "default"}
          className={`bg-violet-800`}
          onPress={handleSubmit}
          disabled={!enabled}
        >
          {!label && <Icon name="arrow-right" color={"#ffffff"} size={20} />}
          {label && (
            <Text className="font-sora-bold text-[14px] text-white">
              {label}
            </Text>
          )}
        </Button>
      </View>
    </View>
  );
}
