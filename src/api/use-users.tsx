import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { BELT_ORDER } from "../constants/belts";
import { UserType } from "../constants/user-type";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";
import axiosClient from "../lib/axios";
import { Database } from "../types/database.types";
import { useCreateNotification } from "./use-create-notification";
import { useRoles } from "./use-roles";

export interface CreateUserProps {
  clerkUserId: string;
  role: UserType;
}

export interface Student {
  role: string;
  firstName: string;
  lastName: string;
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
  instagram: string | null;
  phone: string | null;
  gender: string | null;
  birth: string | null;
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

export function useUsers() {
  const supabase = useSupabase();
  const { showErrorToast } = useToast();
  const { user } = useUser();
  const { isHigherRole } = useRoles();
  const { create } = useCreateNotification();
  const { mutateAsync: createNotification } = create;

  const createUser = useMutation({
    mutationFn: async ({ clerkUserId, role }: CreateUserProps) => {
      const { data, error } = await supabase.from("users").insert({
        clerk_user_id: clerkUserId,
        role: role,
        approved_at: isHigherRole() ? new Date().toISOString() : null,
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

  const getProfile = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const data = await getUserByClerkUserId(user?.id!);
      const { data: gyms } = await supabase
        .from("gyms")
        .select("*")
        .eq("id", data?.gym_id!);
      const gym = gyms?.[0];
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
        const users = await getProfilesInfo(
          data.map((item) => item.clerk_user_id),
        );
        return data
          .map((user) => {
            return {
              ...user,
              name: users.find((u) => u.clerk_user_id === user.clerk_user_id)
                ?.name,
              imageUrl: users.find(
                (u) => u.clerk_user_id === user.clerk_user_id,
              )?.imageUrl,
              belt: user.graduations?.[0]?.belt,
              degree: user.graduations?.[0]?.degree,
              approved_at: user.approved_at,
              denied_at: user.denied_at,
              email: users.find((u) => u.clerk_user_id === user.clerk_user_id)
                ?.email,
              firstName: users.find(
                (u) => u.clerk_user_id === user.clerk_user_id,
              )?.firstName,
              lastName: users.find(
                (u) => u.clerk_user_id === user.clerk_user_id,
              )?.lastName,
            } as Student;
          })
          .sort((a, b) => {
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
  };

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

      await createNotification({
        title: "Parabéns! Seu cadastro foi aprovado",
        content: `Aproveite, agora você pode acessar todos os recursos da plataforma!`,
        recipients: [userId.toString()],
        channel: "push",
        status: "pending",
        viewed_by: [],
      });
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

      await createNotification({
        title: "Que pena! Seu cadastro foi negado",
        content: `Por favor, contate o suporte para mais informações`,
        recipients: [userId.toString()],
        channel: "push",
        status: "pending",
        viewed_by: [],
      });
    },
  });

  const getStudentsApprovalStatus = useQuery({
    queryKey: ["students-approval-status", user?.id],
    queryFn: async () => {
      if (isHigherRole()) {
        return true;
      }
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_user_id", user?.id!);

      if (error) {
        showErrorToast(
          "Erro",
          "Ocorreu um erro ao buscar o status de aprovação dos alunos",
        );
        throw error;
      }

      return data[0].approved_at && !data[0].denied_at;
    },
  });

  const update = useMutation({
    mutationFn: async (
      data: Database["public"]["Tables"]["users"]["Update"],
    ) => {
      const { error } = await supabase
        .from("users")
        .update(data)
        .eq("id", data.id);
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao atualizar o usuário");
        throw error;
      }
    },
  });

  const getCurrentUser = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_user_id", user?.id!);

    if (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar o usuário atual");
      throw error;
    } else if (!data) {
      return null;
    }
    return data[0] as Database["public"]["Tables"]["users"]["Row"];
  };

  const edit = useMutation({
    mutationFn: async (
      data: Database["public"]["Tables"]["users"]["Update"],
    ) => {
      const { error } = await supabase
        .from("users")
        .update(data)
        .eq("id", data.id);
      if (error) {
        console.error(JSON.stringify(error, null, 2));
        showErrorToast("Erro", "Ocorreu um erro ao atualizar o usuário");
        throw error;
      }
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("users")
        .update({
          deleted_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", userId);

      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao deletar o usuário");
        throw error;
      }
    },
  });

  const getBirthdayUsers = useQuery({
    queryKey: ["birthday-users", format(new Date(), "MM-dd")],
    queryFn: async () => {
      const formatted = format(new Date(), "MM-dd");
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("birth_day", formatted);

      if (error) {
        console.error(JSON.stringify(error, null, 2));
        showErrorToast(
          "Erro",
          "Ocorreu um erro ao buscar os usuários de aniversário",
        );
        throw error;
      }

      const users = await getProfilesInfo(
        data.map((item) => item.clerk_user_id),
      );

      return data
        .map((user) => {
          return {
            ...user,
            name: users.find((u) => u.clerk_user_id === user.clerk_user_id)
              ?.name,
          } as Student;
        })
        .sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
    },
  });

  const getInstructorsByGymId = (gymId: number) => {
    return useQuery({
      queryKey: ["instructors-by-gym-id", gymId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("gym_id", gymId)
          .or(
            "role.eq.MANAGER,and(role.eq.INSTRUCTOR,approved_at.not.is.null)",
          );

        if (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar os instrutores");
          throw error;
        }

        const users = await getProfilesInfo(
          data.map((item) => item.clerk_user_id),
        );

        return data.map((user) => {
          return {
            ...user,
            name: users.find((u) => u.clerk_user_id === user.clerk_user_id)
              ?.name,
          } as Student;
        });
      },
    });
  };

  const migrateUser = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("users")
        .update({
          first_name: user?.firstName ?? "",
          last_name: user?.lastName ?? "",
          profile_picture: user?.imageUrl ?? "",
          email: user?.emailAddresses?.[0]?.emailAddress ?? "",
          migrated_at: new Date(),
        })
        .eq("clerk_user_id", user?.id!);
      if (error) {
        showErrorToast("Erro", "Ocorreu um erro ao migrar o usuário");
        throw error;
      }
    },
  });

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
        },
      );
      return data;
    } catch (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar os usuários");
      return null;
    }
  };

  const getProfilesInfo = async (userIds: string[]) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .in("clerk_user_id", userIds);
    if (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar os usuários");
      throw error;
    }

    let users: ProfileInfo[] = [];
    for (const user of data as Database["public"]["Tables"]["users"]["Row"][]) {
      if (user.migrated_at) {
        users.push({
          id: user.id,
          clerk_user_id: user.clerk_user_id,
          name: `${user.first_name} ${user.last_name ?? ""}`,
          email: user.email ?? "",
          imageUrl: user.profile_picture ?? "",
          firstName: user.first_name ?? "",
          lastName: user.last_name ?? "",
        });
      } else {
        users.push({
          id: user.id,
          clerk_user_id: user.clerk_user_id,
          name: "",
          email: "",
          imageUrl: "",
          firstName: "",
          lastName: "",
        });
      }
    }

    if (data.some((user) => !user.migrated_at)) {
      const clerkUsers = await getClerkUsers(
        data
          .filter((user) => !user.migrated_at)
          .map((user) => user.clerk_user_id),
      );
      for (const user of clerkUsers) {
        const index = users.findIndex((u) => u.clerk_user_id === user.id);
        if (index !== -1) {
          users[index].name = user.first_name + " " + user.last_name;
          users[index].email = user.email;
          users[index].imageUrl = user.image_url;
          users[index].firstName = user.first_name ?? "";
          users[index].lastName = user.last_name ?? "";
        }
      }
    }

    return users;
  };

  return {
    createUser,
    getUserByClerkUserId,
    getUserById,
    getProfile,
    getStudentsByGymId,
    approveStudent,
    denyStudent,
    getStudentsApprovalStatus,
    update,
    getCurrentUser,
    edit,
    deleteUser,
    getBirthdayUsers,
    getInstructorsByGymId,
    migrateUser,
    getProfilesInfo,
  };
}
