import { useApi } from "@/src/hooks/use-api";
import { mapToClassRow } from "./map-class";

export async function getClassToCheckIn(
  gymId: number,
  time: string,
  day: string,
) {
  const { get } = useApi();

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
}
