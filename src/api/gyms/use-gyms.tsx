import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/use-api";
import { useToast } from "../../hooks/use-toast";
import { useCreateNotification } from "../notifications/use-create-notification";
import { CreateGymProps } from "./types";

export function useGyms() {
  const { showErrorToast } = useToast();
  const { get, post } = useApi();
  const { mutateAsync: createNotification } = useCreateNotification().create;

  const createGym = useMutation({
    mutationFn: async ({
      gym,
      userId,
    }: {
      gym: CreateGymProps;
      userId: number;
    }) => {
      try {
        const { data } = await post<any>("/gyms", {
          name: gym.name,
          address: gym.address,
          since: gym.since,
          logo: gym.logo ?? undefined,
          userId: userId,
        });
        return data;
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao criar a academia");
        throw error;
      }
    },
  });

  const fetchByUser = (userId: number | undefined) => {
    return useQuery({
      queryKey: ["gym-by-user", userId],
      queryFn: async () => {
        if (userId == null || userId === 0) return null;
        try {
          const { data } = await get<any>(`/gyms/user/${userId}`);
          return data;
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar a academia");
          throw error;
        }
      },
      enabled: !!userId,
    });
  };

  const fetchAll = useQuery({
    queryKey: ["gyms"],
    queryFn: async () => {
      try {
        const { data } = await get<any>("/gyms");
        return data ?? [];
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao buscar as academias");
        throw error;
      }
    },
  });

  const getById = async (gymId: number) => {
    try {
      const { data } = await get<any>(`/gyms/${gymId}`);
      return data;
    } catch (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar a academia");
      throw error;
    }
  };

  const associateGym = useMutation({
    mutationFn: async ({
      gymId,
      userId,
    }: {
      gymId: number;
      userId: number;
    }) => {
      try {
        await post("/gyms/associate", {
          gymId,
          userId,
        });
        const gym = await getById(gymId);
        await createNotification({
          title: "Novo aluno associado a academia",
          content: `Verifique na lista de alunos para aprovar ou negar a associação`,
          recipients: [gym.managerId.toString()],
          channel: "push",
          status: "pending",
          viewed_by: [userId.toString()],
          sent_by: userId,
        });
      } catch (error) {
        showErrorToast("Erro", "Ocorreu um erro ao associar a academia");
        throw error;
      }
    },
  });

  return {
    createGym,
    fetchByUser,
    fetchAll,
    associateGym,
  };
}
