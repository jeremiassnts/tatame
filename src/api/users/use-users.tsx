import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { UserType } from "../../constants/user-type";
import { useApi } from "../../hooks/use-api";
import { useToast } from "../../hooks/use-toast";
import { useRoles } from "../roles/use-roles";

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

export function useUsers() {
  const { user: clerkUser } = useUser();
  const { showErrorToast } = useToast();
  const { isHigherRole } = useRoles();
  const { get, post, put, del } = useApi();

  const getUser = useQuery({
    queryKey: ["user", clerkUser?.id],
    queryFn: async () => {
      if (!clerkUser?.id) return null;
      try {
        const { data } = await get<any>(`/users/clerk/${clerkUser.id}`);
        return data;
      } catch (error) {
        return null;
      }
    },
    enabled: !!clerkUser?.id,
  });

  const createUser = useMutation({
    mutationFn: async ({
      clerkUserId,
      role,
      email,
      firstName,
      lastName,
      profilePicture,
    }: CreateUserProps) => {
      const { data } = await post<any>("/users", {
        clerk_user_id: clerkUserId,
        role: role,
        approved_at: isHigherRole(role) ? new Date().toISOString() : null,
        email: email,
        firstName: firstName,
        lastName: lastName,
        profilePicture: profilePicture ?? "",
      });
      console.log(data);
      return data;
    },
  });

  const getUserByClerkUserId = async (clerkUserId: string) => {
    try {
      const { data } = await get<any>(`/users/clerk/${clerkUserId}`);
      console.log(data);
      return data;
    } catch (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar o usuário");
      throw error;
    }
  };

  const getUserById = async (userId: number) => {
    try {
      const { data } = await get<any>(`/users/${userId}`);
      console.log(data);
      return data;
    } catch (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar o usuário");
      throw error;
    }
  };

  const getStudentsByGymId = (gymId: number) => {
    return useQuery({
      queryKey: ["students-by-gym-id", gymId],
      queryFn: async () => {
        try {
          const { data } = await get<any>(`/users/gym/${gymId}/students`);
          console.log(data);
          return data;
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar os alunos");
          throw error;
        }
      },
    });
  };

  const approveStudent = useMutation({
    mutationFn: async (userId: number) => {
      try {
        await post<any>(`/users/approve`, {
          userId,
        });
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao aprovar o aluno");
        throw error;
      }
    },
  });

  const denyStudent = useMutation({
    mutationFn: async (userId: number) => {
      try {
        await post<any>(`/users/deny`, {
          userId,
        });
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao negar o aluno");
        throw error;
      }
    },
  });

  const getStudentsApprovalStatus = (userId: number) =>
    useQuery({
      queryKey: ["students-approval-status", userId],
      queryFn: async () => {
        try {
          const { data } = await get<any>(`/users/${userId}/approval-status`);
          console.log(data);
          return data;
        } catch (error) {
          showErrorToast(
            "Erro",
            "Ocorreu um erro ao buscar o status de aprovação dos alunos",
          );
          throw error;
        }
      },
    });

  const update = useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await put<any>(`/users/${data.id}`, data);
        console.log(response);
        return response.data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao atualizar o usuário");
        throw error;
      }
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      try {
        const { data } = await del<any>(`/users/${userId}`);
        console.log(data);
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao deletar o usuário");
        throw error;
      }
    },
  });

  const getBirthdayUsers = useQuery({
    queryKey: ["birthday-users", format(new Date(), "MM-dd")],
    queryFn: async () => {
      try {
        const { data } = await get<any>(`/users/birthdays/today`);
        console.log(data);
        return data;
      } catch (error) {
        showErrorToast(
          "Erro",
          "Ocorreu um erro ao buscar os usuários de aniversário",
        );
        throw error;
      }
    },
  });

  const getInstructorsByGymId = (gymId: number) => {
    return useQuery({
      queryKey: ["instructors-by-gym-id", gymId],
      queryFn: async () => {
        try {
          const { data } = await get<any>(`/users/gym/${gymId}/instructors`);
          console.log(data);
          return data;
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar os instrutores");
          throw error;
        }
      },
    });
  };

  return {
    getUser,
    createUser,
    getUserByClerkUserId,
    getUserById,
    getStudentsByGymId,
    approveStudent,
    denyStudent,
    getStudentsApprovalStatus,
    update,
    deleteUser,
    getBirthdayUsers,
    getInstructorsByGymId,
  };
}
