import { useApi } from "@/src/hooks/use-api";
import { useQuery } from "@tanstack/react-query";
export interface GetLastVersionResponse {
  data: {
    appVersion: string;
    disabledAt: string | null;
  };
}

export function useGetLastVersion() {
  const { get } = useApi();

  return useQuery({
    queryKey: ["versions"],
    queryFn: async () => {
      const { data } = await get<GetLastVersionResponse>("/versions", {
        isPublic: true,
      });
      return data;
    },
  });
}
