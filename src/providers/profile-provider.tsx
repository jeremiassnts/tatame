import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { useApi } from "../hooks/use-api";
import { Database } from "../types/database.types";

interface ProfileContextType {
    user: Database["public"]["Tables"]["users"]["Row"] | undefined | null;
    gym: Database["public"]["Tables"]["gyms"]["Row"] | undefined | null;
    refetch: (() => Promise<void>) | null;
    isLoading: boolean;
}
export const ProfileContext = createContext<ProfileContextType>({
    user: undefined,
    gym: undefined,
    isLoading: false,
    refetch: null,
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const { user: signedInUser } = useUser();
    const { get } = useApi();

    const user = useQuery({
        queryKey: ["user", signedInUser?.id],
        queryFn: async () => {
            if (!signedInUser?.id) return null;
            try {
                const { data } = await get<any>(`/users/clerk/${signedInUser.id}`);
                return data;
            } catch (error) {
                return null;
            }
        },
        enabled: !!signedInUser?.id,
    });
    const gym = useQuery({
        queryKey: ["gym-by-user", user.data?.id],
        queryFn: async () => {
            if (user.data?.id == null || user.data?.id === 0) return null;
            try {
                const { data } = await get<any>(`/gyms/user/${user.data?.id}`);
                return data;
            } catch (error) {
                return null;
            }
        },
        enabled: !!user.data?.id,
    });

    return (
        <ProfileContext.Provider
            value={{
                user: user.data,
                gym: gym.data,
                isLoading: user.isLoading || gym.isLoading,
                refetch: async () => {
                    await Promise.all([user.refetch(), gym.refetch()]);
                },
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
}
