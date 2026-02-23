import { UserType } from "@/src/constants/user-type";
import { useApi } from "@/src/hooks/use-api";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useMutation } from "@tanstack/react-query";

export interface CreateUserProps {
  clerkUserId: string;
  role: UserType;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export function useCreateUser() {
  const { post } = useApi();
  const { user } = useProfileContext();

  return useMutation({
    mutationFn: async ({
      clerkUserId,
      role,
      email,
      firstName,
      lastName,
      profilePicture,
    }: CreateUserProps) => {
      const { data } = await post<any>("/users", {
        clerkUserId,
        role,
        approvedAt: user?.role === "MANAGER" ? new Date().toISOString() : null,
        email,
        firstName,
        lastName,
        profilePicture: profilePicture ?? "",
      });
      return data;
    },
  });
}
