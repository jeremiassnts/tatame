import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { UserType } from "../../constants/user-type";
import { useApi } from "../../hooks/use-api";
import { useToast } from "../../hooks/use-toast";
import { useCreateNotification } from "../notifications/use-create-notification";

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
  const { showErrorToast } = useToast();
  const { get, post, put, del } = useApi();
  const { mutateAsync: createNotification } = useCreateNotification().create();
  const { user } = useProfileContext();

  const createUser = () => {
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
          clerkUserId: clerkUserId,
          role: role,
          approved_at:
            user?.role === "MANAGER" ? new Date().toISOString() : null,
          email: email,
          firstName: firstName,
          lastName: lastName,
          profilePicture: profilePicture ?? "",
        });
        return data;
      },
    });
  };

  const getUserByClerkUserId = async (clerkUserId: string) => {
    try {
      const { data } = await get<any>(`/users/clerk/${clerkUserId}`);
      return data;
    } catch (error) {
      showErrorToast(
        "Erro",
        "Ocorreu um erro ao buscar o usuário com o Clerk ID",
      );
      throw error;
    }
  };

  const getUserById = async (userId: number) => {
    try {
      const { data } = await get<any>(`/users/${userId}`);
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
          return data;
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar os alunos");
          throw error;
        }
      },
    });
  };

  const approveStudent = () => {
    return useMutation({
      mutationFn: async (userId: number) => {
        try {
          await post<any>(`/users/approve`, {
            userId,
          });
          await createNotification({
            title: "Parabéns! Seu cadastro foi aprovado",
            content: `Aproveite, agora você pode acessar todos os recursos da plataforma!`,
            recipients: [userId.toString()],
            channel: "push",
            status: "pending",
            viewed_by: [],
          });
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao aprovar o aluno");
          throw error;
        }
      },
    });
  };

  const denyStudent = () => {
    return useMutation({
      mutationFn: async (userId: number) => {
        try {
          await post<any>(`/users/deny`, {
            userId,
          });
          await createNotification({
            title: "Que pena! Seu cadastro foi negado",
            content: `Por favor, contate o suporte para mais informações`,
            recipients: [userId.toString()],
            channel: "push",
            status: "pending",
            viewed_by: [],
          });
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao negar o aluno");
          throw error;
        }
      },
    });
  };

  const getStudentsApprovalStatus = () => {
    return useQuery({
      queryKey: ["students-approval-status", user?.id],
      queryFn: async () => {
        try {
          if (!user?.id) return false;
          const { data } = await get<any>(`/users/${user?.id}/approval-status`);
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
  };

  const update = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        try {
          const response = await put<any>(`/users/${data.id}`, data);
          return response.data;
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao atualizar o usuário");
          throw error;
        }
      },
    });
  };

  const deleteUser = () => {
    return useMutation({
      mutationFn: async (userId: string) => {
        try {
          const { data } = await del<any>(`/users/${userId}`);
          return data;
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao deletar o usuário");
          throw error;
        }
      },
    });
  };

  const getBirthdayUsers = () => {
    return useQuery({
      queryKey: ["birthday-users", format(new Date(), "MM-dd")],
      queryFn: async () => {
        try {
          const { data } = await get<any>(`/users/birthdays/today`);
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
  };

  const getInstructorsByGymId = (gymId: number) => {
    return useQuery({
      queryKey: ["instructors-by-gym-id", gymId],
      queryFn: async () => {
        try {
          const { data } = await get<any>(`/users/gym/${gymId}/instructors`);
          return data;
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar os instrutores");
          throw error;
        }
      },
    });
  };

  return {
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
