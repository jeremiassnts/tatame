import { useProfileContext } from "@/src/hooks/use-profile-context";

export function useRoles() {
  const { user } = useProfileContext();

  const isHigherRole = (role?: string) => {
    const _role = role ?? user?.role;
    return _role === "MANAGER";
  };

  const isMediumRole = (role?: string) => {
    const _role = role ?? user?.role;
    return _role === "INSTRUCTOR" || _role === "MANAGER";
  };

  const isLowerRole = (role?: string) => {
    const _role = role ?? user?.role;
    return _role === "STUDENT";
  };

  return {
    isHigherRole,
    isMediumRole,
    isLowerRole,
  };
}
