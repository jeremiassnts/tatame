import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/use-api";
import { GetLastVersionResponse } from "./types";

export function useVersions() {
    const { get } = useApi();

    const getLastVersion = useQuery({
        queryKey: ["versions"],
        queryFn: async () => {
            const { data } = await get<GetLastVersionResponse>("/versions", {
                isPublic: true,
            });
            return data;
        },
    });

    return {
        getLastVersion,
    };
}
