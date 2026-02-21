import { useProfileContext } from "@/src/hooks/use-profile-context";

export function isLowerRole(role?: string) {
  const { user } = useProfileContext();

  const _role = role ?? user?.role;
  return _role === "STUDENT";
}
