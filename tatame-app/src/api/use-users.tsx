import { useAuth } from "@clerk/clerk-expo";
import { createSupabaseClerkClient } from "../utils/supabase";
import { UserType } from "../constants/user-type";
import { useToast } from "../hooks/use-toast";

export interface CreateUserProps {
  clerkUserId: string;
  role: UserType;
}

export function useUsers() {
  const { getToken } = useAuth();
  const { showErrorToast } = useToast();

  const createUser = async (props: CreateUserProps) => {
    const supabase = createSupabaseClerkClient(getToken());
    const { clerkUserId, role } = props;
    const { data, error } = await supabase.from("users").insert({
      clerk_user_id: clerkUserId,
      role: role,
    });
    if (error) {
      showErrorToast("Erro", "Ocorreu um erro ao criar o usuário");
      throw error;
    }

    return data;
  };

  const getUserByClerkUserId = async (clerkUserId: string) => {
    const supabase = createSupabaseClerkClient(getToken());
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_user_id", clerkUserId);
    if (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar o usuário");
      throw error;
    }
    return data[0];
  };

  return {
    createUser,
    getUserByClerkUserId,
  };
}
