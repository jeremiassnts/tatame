import { useProfileContext } from "@/src/hooks/use-profile-context";

export function useIsMediumRole() {
  const { user } = useProfileContext();

  return (role?: string) => {
    const _role = role ?? user?.role;
    return _role === "INSTRUCTOR" || _role === "MANAGER";
  };
}
