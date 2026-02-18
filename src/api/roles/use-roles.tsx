
export function useRoles() {
  const isHigherRole = (role: string) => {
    return role === "MANAGER";
  };

  const isMediumRole = (role: string) => {
    return role === "INSTRUCTOR" || role === "MANAGER";
  };

  const isLowerRole = (role: string) => {
    return role === "STUDENT";
  };

  return {
    isHigherRole,
    isMediumRole,
    isLowerRole,
  };
}
