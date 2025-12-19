import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BELT_ORDER } from "../constants/belts";
import { UserType } from "../constants/user-type";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";
import axiosClient from "../lib/axios";
import { useRoles } from "./use-roles";

export interface CreateUserProps {
  clerkUserId: string;
  role: UserType;
}

export interface Student {
  email: string;
  approved_at: string | null;
  denied_at: string | null;
  id: number;
  clerk_user_id: string;
  gym_id: number;
  name: string;
  imageUrl: string;
  belt: string;
  degree: number;
}

export function useUsers() {
  const supabase = useSupabase();
  const { showErrorToast } = useToast();
  const { user } = useUser();
  const { getRoleByUserId } = useRoles();

  const createUser = useMutation({
    mutationFn: async ({ clerkUserId, role }: CreateUserProps) => {
      const { data, error } = await supabase.from("users").insert({
        clerk_user_id: clerkUserId,
        role: role,
        approved_at: role === "MANAGER" ? new Date().toISOString() : null,
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
      console.error(JSON.stringify(error, null, 2));
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
      console.error(JSON.stringify(error, null, 2));
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
      console.error(JSON.stringify(error, null, 2));
      showErrorToast("Erro", "Ocorreu um erro ao buscar o usuário clerk");
      return null;
    }
  };

  const getClerkUsers = async (userIds: string[]) => {
    try {
      const { data } = await axiosClient.post(
        `/clerk-get-users`,
        {
          user_id: userIds,
          limit: userIds.length,
          offset: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        }
      );
      return data;
    } catch (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar os usuários");
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

  const getStudentsByGymId = (gymId: number) => {
    return useQuery({
      queryKey: ["students-by-gym-id", gymId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("users")
          .select("*, graduations(belt, degree)")
          .eq("gym_id", gymId);
        if (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar os alunos");
          throw error;
        }
        const clerkUsers = await getClerkUsers(data.map((user) => user.clerk_user_id!));
        return data.map((user) => {
          const clerkUser = clerkUsers?.find(
            (u) => u.id === user.clerk_user_id
          );
          if (!clerkUser) {
            console.log("Clerk user not found");
          }
          return {
            ...user,
            name: `${clerkUser?.first_name} ${clerkUser?.last_name}`,
            imageUrl: clerkUser?.image_url,
            belt: user.graduations?.[0]?.belt,
            degree: user.graduations?.[0]?.degree,
            approved_at: user.approved_at,
            denied_at: user.denied_at,
            email: clerkUser?.email_addresses?.[0]?.email_address,
          } as Student;
        }).sort((a, b) => {
          if (a.belt === b.belt) {
            if (a.degree === b.degree) {
              return a.name.localeCompare(b.name);
            }
            return b.degree! - a.degree!;
          }
          //@ts-ignore
          return BELT_ORDER[a.belt] - BELT_ORDER[b.belt];
        });
      },
    });
  }

  const approveStudent = useMutation({
    mutationFn: async (userId: number) => {
      const { error } = await supabase
        .from("users")
        .update({ approved_at: new Date().toISOString(), denied_at: null })
        .eq("id", userId);
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao aprovar o aluno");
        throw error;
      }
    },
  });

  const denyStudent = useMutation({
    mutationFn: async (userId: number) => {
      const { error } = await supabase
        .from("users")
        .update({ denied_at: new Date().toISOString(), approved_at: null })
        .eq("id", userId);
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao negar o aluno");
        throw error;
      }
    },
  });

  const getStudentsApprovalStatus = useQuery({
    queryKey: ["students-approval-status", user?.id],
    queryFn: async () => {
      const role = await getRoleByUserId();
      if (role === "MANAGER") {
        return true;
      }
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_user_id", user?.id!);

      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar o status de aprovação dos alunos");
        throw error;
      }

      return data[0].approved_at && !data[0].denied_at;
    },
  });

  return {
    createUser,
    getUserByClerkUserId,
    getUserById,
    getClerkUserById,
    getClerkUsers,
    getUserProfile,
    getStudentsByGymId,
    approveStudent,
    denyStudent,
    getStudentsApprovalStatus,
  };
}
