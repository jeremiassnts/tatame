import { View } from "react-native";

interface StepVisualizerProps {
  count: number;
  current: number;
}

export default function StepVisualizer({
  count,
  current,
}: StepVisualizerProps) {
  return (
    <View className="flex flex-row gap-1.5">
      {new Array(count)
        .fill(0)
        .map((_, index) =>
          index == current ? (
            <View
              key={index}
              className="bg-violet-800 w-[30px] h-[10px] rounded-full"
            />
          ) : (
            <View
              key={index}
              className="bg-neutral-600 w-[10px] h-[10px] rounded-full"
            />
          )
        )}
    </View>
  );
}
