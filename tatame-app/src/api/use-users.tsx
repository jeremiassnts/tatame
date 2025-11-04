import { useAuth } from "@clerk/clerk-expo";
import { createSupabaseClerkClient } from "../utils/supabase";
import { UserType } from "../constants/user-type";
import { useToast } from "../hooks/use-toast";
import axiosClient from "../lib/axios";

export interface CreateUserProps {
  clerkUserId: string;
  role: UserType;
}

export function useUsers() {
  const { getToken } = useAuth();
  const supabase = createSupabaseClerkClient(getToken());
  const { showErrorToast } = useToast();

  const createUser = async (props: CreateUserProps) => {
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

  const getUserById = async (userId: number) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId);
    if (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar o usuário");
      throw error;
    }
    return data[0];
  };

  const getClerkUserById = async (userId: string) => {
    try {
      const { data } = await axiosClient.get<{ id: string; name: string }>(
        `/clerk-get-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        }
      );
      return data;
    } catch (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar o usuário");
      return null;
    }
  };

  return {
    createUser,
    getUserByClerkUserId,
    getUserById,
    getClerkUserById,
  };
}
