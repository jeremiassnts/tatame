import { createContext } from "react";
import { useGyms } from "../api/gyms/use-gyms";
import { useUsers } from "../api/users/use-users";
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
    const { getUser } = useUsers();
    const { fetchByUser } = useGyms();

    return (
        <ProfileContext.Provider
            value={{
                user: getUser.data,
                gym: fetchByUser.data,
                isLoading: getUser.isLoading || fetchByUser.isLoading,
                refetch: async () => {
                    await Promise.all([getUser.refetch(), fetchByUser.refetch()]);
                },
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
}
