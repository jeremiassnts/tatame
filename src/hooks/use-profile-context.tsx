import { useContext } from "react";
import { ProfileContext } from "../providers/profile-provider";

export function useProfileContext() {
    return useContext(ProfileContext);
}
