import { Pressable, Text, View } from "react-native";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Icon from "@react-native-vector-icons/feather";

interface ManagerSubscribePlanProps {
  title: string;
  description: string;
  selected: boolean;
  items: string[];
  price: number;
  priceYear: number;
  onChangeSelected: () => void;
  className?: string;
  currency: string;
}

export default function ManagerSubscribePlan({
  title,
  description,
  items,
  selected,
  onChangeSelected,
  className,
  price,
  priceYear,
  currency,
}: ManagerSubscribePlanProps) {
  return (
    <Pressable onPress={onChangeSelected} className={className}>
      <Card
        className={`w-full max-w-sm bg-neutral-800 ${
          selected ? "border-violet-600" : "border-neutral-700"
        }`}
      >
        <CardHeader>
          <CardTitle className="font-sora-bold text-[18px]">{title}</CardTitle>
          <CardDescription className="font-sora text-[14px]">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <View className="w-full h-[1px] bg-neutral-700 mt-[-10px] mb-2" />
          {items.map((item) => (
            <View
              key={item}
              className="flex flex-row items-center justify-start gap-1"
            >
              <Icon name="check" color={"rgb(124 58 237)"} size={16} />
              <Text className="font-sora text-[14px] text-white">{item}</Text>
            </View>
          ))}
        </CardContent>
        {price > 0 && (
          <CardFooter className="flex flex-col items-center mt-[-10px]">
            <Text className="bg-neutral-600 font-sora-bold text-[14px] text-white pt-1 pb-1 pl-5 pr-5 rounded-md">
              Primeiro mês gratuito
            </Text>
            <View className="flex flex-row items-baseline gap-1 justify-center w-full">
              <Text className="font-sora-bold text-[20px] text-violet-600">
                {currency}
              </Text>
              <Text className="font-sora-bold text-[45px] text-violet-600">
                {(price / 100).toFixed(2)}
              </Text>
              <Text className="font-sora-bold text-[20px] text-violet-600">
                /MÊS
              </Text>
            </View>
            {/* <Text className="font-sora text-neutral-400 text-center">
              OU {currency + " "} {(priceYear / 100).toFixed(2)} POR ANO
            </Text> */}
          </CardFooter>
        )}
        {price == 0 && (
          <CardFooter>
            <Text className="font-sora-bold text-[40px] text-violet-600 text-center w-full">
              Gratuito
            </Text>
          </CardFooter>
        )}
      </Card>
    </Pressable>
  );
}
