import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { useApi } from "../hooks/use-api";
import { Gym, User } from "../types/models";

type UserInfo = {
    fullName: string;
} & User;
interface ProfileContextType {
    user: UserInfo | undefined | null;
    gym: Gym | undefined | null;
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
        queryKey: ["user-profile", signedInUser?.id],
        queryFn: async () => {
            if (!signedInUser?.id) return null;
            try {
                const { data } = await get<any>(`/users/clerk/${signedInUser.id}`);
                return {
                    fullName: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
                    ...data,
                };
            } catch {
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
                const { data } = await get<any>(`/gyms/${user.data?.gymId}`);
                return data;
            } catch {
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
