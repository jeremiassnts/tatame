import { WeekDay } from "@/src/types/date";
import { addDays, format, isBefore, subDays } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { ptBR } from "date-fns/locale";
import { SafeAreaView } from "react-native-safe-area-context";
import { Days } from "@/src/constants/date";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import WeekDays from "@/src/components/weekDays";
import { ScrollView } from "react-native";
import { BaseGymRow, ClassRow } from "@/src/types/extendend-database.types";
import { useClass } from "@/src/api/use-class";
import { useUser } from "@clerk/clerk-expo";
import { useUsers } from "@/src/api/use-users";
import { useGyms } from "@/src/api/use-gyms";
import { ClassCard } from "@/src/components/class-card";
import { AddIcon } from "@/src/components/ui/icon";
import { Button, ButtonIcon } from "@/src/components/ui/button";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { useRouter } from "expo-router";
import { ChangeContext } from "../../providers/change-provider";

export default function Schedule() {
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<WeekDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchClassesByGymId } = useClass();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const { user } = useUser();
  const { getUserByClerkUserId } = useUsers();
  const { fetchGymByManagerId } = useGyms();
  const [gym, setGym] = useState<BaseGymRow | null>(null);
  const router = useRouter();
  const { lastChangeId } = useContext(ChangeContext);

  useEffect(() => {
    async function defineWeekDays() {
      const today = new Date();
      const tempWeekDays: WeekDay[] = [];
      for (
        let current = subDays(today, 3);
        isBefore(current, addDays(today, 4));
        current = addDays(current, 1)
      ) {
        tempWeekDays.push({
          title: format(current, "EEEE", { locale: ptBR }),
          shortTitle: format(current, "EEE", { locale: ptBR }).substring(0, 3),
          isSelected: false,
          date: current,
          dayOfWeek: Days.find(
            (w) =>
              w.label.toLowerCase() ===
              format(current, "EEEE", { locale: ptBR }).toLowerCase()
          )?.value,
        });
      }
      setWeekDays(tempWeekDays);
      setSelectedDay(
        tempWeekDays.find((w) => w.date.getDate() === today.getDate()) || null
      );
    }

    async function fetchData() {
      if (user?.id) {
        const sp_user = await getUserByClerkUserId(user.id);
        if (sp_user) {
          const sp_gym = await fetchGymByManagerId(sp_user.id);
          setGym(sp_gym);
          if (sp_gym) {
            const sp_classes = await fetchClassesByGymId(sp_gym.id);
            setClasses(sp_classes);
          }
        }
      }
      setIsLoading(false);
    }

    setIsLoading(true);
    Promise.all([defineWeekDays(), fetchData()]).then(() => {
      setIsLoading(false);
    });
  }, [lastChangeId]);

  function handleSelectDay(day: WeekDay) {
    setSelectedDay(day);
  }

  return (
    <SafeAreaView className="pt-10 pl-5 pr-5 pb-10 flex-1 flex flex-col items-start">
      <Button
        size="md"
        variant="solid"
        className="bg-violet-800 rounded-full w-[50px] h-[50px] absolute bottom-5 right-5"
        onPress={() => router.push("/(logged)/(home)/create-class")}
      >
        <ButtonIcon as={AddIcon} color="white" />
      </Button>
      <Badge
        size="lg"
        variant="solid"
        action="muted"
        className="rounded-sm self-start mb-4"
      >
        <BadgeText>Agenda</BadgeText>
      </Badge>
      <Box className="w-full max-h-[100px]">
        <WeekDays
          weekDays={weekDays}
          selectedDay={selectedDay ?? ({} as WeekDay)}
          handleSelectDay={handleSelectDay}
          isLoading={isLoading}
        />
      </Box>
      <ScrollView className="w-full pt-6">
        <VStack className="gap-4 w-full">
          {classes
            .filter((item) => item.day === selectedDay?.dayOfWeek)
            .map((item) => (
              <ClassCard key={item.id} data={item} />
            ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
