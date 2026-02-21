import { useProfileContext } from "@/src/hooks/use-profile-context";

export function useIsLowerRole() {
  const { user } = useProfileContext();

  return (role?: string) => {
    const _role = role ?? user?.role;
    return _role === "STUDENT";
  };
}
