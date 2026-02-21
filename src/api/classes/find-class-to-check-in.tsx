import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { mapToClassRow } from "./map-class";

export function useFindClassToCheckIn() {
  const { get } = useApi();

  return async function findClassToCheckIn(
    gymId: number,
    time: string,
    day: string,
  ) {
    try {
      const { data } = await get<any>(
        `/class/check-in/available?gymId=${gymId}&time=${encodeURIComponent(time)}&day=${encodeURIComponent(day)}`,
      );
      const raw = Array.isArray(data) ? data[0] : data;
      return raw ? mapToClassRow(raw) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
}
