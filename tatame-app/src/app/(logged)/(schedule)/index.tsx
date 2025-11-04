import { WeekDay } from "@/src/types/date";
import { addDays, format, isBefore, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { ptBR } from "date-fns/locale";
import { SafeAreaView } from "react-native-safe-area-context";
import { Days } from "@/src/constants/date";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import WeekDays from "@/src/components/weekDays";
import { ScrollView } from "react-native";
import { BaseGymRow, ClassRow } from "@/src/types/extendend-database.types";
import { useClass } from "@/src/api/use-class";
import { useUser } from "@clerk/clerk-expo";
import { useUsers } from "@/src/api/use-users";
import { useGyms } from "@/src/api/use-gyms";
import { ClassCard } from "@/src/components/class-card";

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

    Promise.all([defineWeekDays(), fetchData()]).then(() => {
      setIsLoading(false);
    });
  }, []);

  function handleSelectDay(day: WeekDay) {
    setSelectedDay(day);
  }

  return (
    <SafeAreaView className="pt-10 pl-5 pr-5 pb-10">
      <Badge
        size="lg"
        variant="solid"
        action="muted"
        className="rounded-sm self-start mb-4"
      >
        <BadgeText>Agenda</BadgeText>
      </Badge>
      <WeekDays
        weekDays={weekDays}
        selectedDay={selectedDay ?? ({} as WeekDay)}
        handleSelectDay={handleSelectDay}
        isLoading={isLoading}
      />
      <ScrollView className="ml-[-10px] mr-[-10px]">
        {classes
          .filter((item) => item.day === selectedDay?.dayOfWeek)
          .map((item) => (
            <ClassCard key={item.id} data={item} />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
