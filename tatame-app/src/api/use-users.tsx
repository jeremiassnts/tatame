import { useAuth, useUser } from "@clerk/clerk-expo";
import { createSupabaseClerkClient } from "../utils/supabase";
import { UserType } from "../constants/user-type";
import { useToast } from "../hooks/use-toast";
import axiosClient from "../lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useGyms } from "./use-gyms";

export interface CreateUserProps {
  clerkUserId: string;
  role: UserType;
}

export function useUsers() {
  const { getToken } = useAuth();
  const supabase = createSupabaseClerkClient(getToken());
  const { showErrorToast } = useToast();
  const { user } = useUser();

  const createUser = useMutation({
    mutationFn: async ({ clerkUserId, role }: CreateUserProps) => {
      const { data, error } = await supabase.from("users").insert({
        clerk_user_id: clerkUserId,
        role: role,
      });
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao criar o usuário");
        throw error;
      }

      return data;
    },
  });

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

  const getUserProfile = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const data = await getUserByClerkUserId(user?.id!);
      const gym = await supabase
        .from("gyms")
        .select("*")
        .eq("id", data?.gym_id!)
        .single();

      return {
        ...user,
        ...data,
        gym,
      };
    },
  });

  return {
    createUser,
    getUserByClerkUserId,
    getUserById,
    getClerkUserById,
    getUserProfile,
  };
}
