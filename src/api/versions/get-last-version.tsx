import { useApi } from "@/src/hooks/use-api";
import { useQuery } from "@tanstack/react-query";
import { GetLastVersionResponse } from "./types";

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
