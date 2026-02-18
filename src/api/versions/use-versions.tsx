import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/use-api";

export function useVersions() {
    const { get } = useApi();

    const getLastVersion = useQuery({
        queryKey: ["versions"],
        queryFn: async () => {
            const { data } = await get<any>("/versions");
            return data;
        },
    });

    return {
        getLastVersion,
    };
}
