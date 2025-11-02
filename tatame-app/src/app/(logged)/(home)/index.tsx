import { Avatar, AvatarImage } from "@/src/components/ui/avatar";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useUser } from "@clerk/clerk-expo";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { user } = useUser();

  const shift = useMemo(() => {
    const now = new Date();
    const shift = now.getHours();
    if (shift > 4 && shift < 13) return "BOM DIA";
    if (shift > 12 && shift < 18) return "BOA TARDE";
    return "BOA NOITE";
  }, []);

  return (
    <SafeAreaView className="p-10">
      <VStack className="items-start gap-6">
        <Badge size="lg" variant="solid" action="muted" className="rounded-sm">
          <BadgeText>Home</BadgeText>
        </Badge>
        <HStack className="gap-3">
          <Avatar size="md">
            <AvatarImage
              source={{
                uri: user?.imageUrl,
              }}
            />
          </Avatar>
          <VStack>
            <Text className="text-sm font-medium text-white uppercase">{shift},</Text>
            <Text className="text-lg font-bold text-white uppercase">{user?.fullName}</Text>
          </VStack>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
}
