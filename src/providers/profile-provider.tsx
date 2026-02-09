import { createContext } from "react";
import { useUsers } from "../api/use-users";

interface ProfileContextType {
    profile: any | undefined;
    isLoading: boolean;
}
export const ProfileContext = createContext<ProfileContextType>({
    profile: undefined,
    isLoading: false,
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const { getProfile } = useUsers();

    return (
        <ProfileContext.Provider
            value={{
                profile: getProfile.data,
                isLoading: getProfile.isLoading,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
}
