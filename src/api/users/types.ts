import { UserType } from "@/src/constants/user-type";

export interface CreateUserProps {
  clerkUserId: string;
  role: UserType;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export interface ProfileInfo {
  id: number;
  clerk_user_id: string;
  name: string;
  email: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
}
