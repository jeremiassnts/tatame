import { useContext } from "react";
import { ChangeContext } from "../app/providers/change-provider";

export function useChangeContext() {
    return useContext(ChangeContext);
}