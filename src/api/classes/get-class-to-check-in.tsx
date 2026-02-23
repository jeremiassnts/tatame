import { useApi } from "@/src/hooks/use-api";

export function useGetClassToCheckIn() {
  const { get } = useApi();

  return async (gymId: number, time: string, day: string) => {
    try {
      const { data } = await get<any>(
        `/class/check-in/available?gymId=${gymId}&time=${encodeURIComponent(time)}&day=${encodeURIComponent(day)}`,
      );
      if (!data) return null;
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
}
