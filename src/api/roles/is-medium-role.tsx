import { useProfileContext } from "@/src/hooks/use-profile-context";

export function isMediumRole(role?: string) {
  const { user } = useProfileContext();

  const _role = role ?? user?.role;
  return _role === "INSTRUCTOR" || _role === "MANAGER";
}
