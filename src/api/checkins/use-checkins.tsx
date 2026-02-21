import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/use-api";
import { useToast } from "../../hooks/use-toast";
import { Checkin } from "../../types/models";
import { CreateCheckinProps } from "./types";

export function useCheckins() {
  const { get, post, del } = useApi();
  const { showErrorToast } = useToast();

  const create = () => {
    return useMutation({
      mutationFn: async (checkin: CreateCheckinProps) => {
        try {
          const { data: existing } = await get<any>(
            `/checkins/class/${checkin.classId}/user/${checkin.userId}`,
          );
          const list = Array.isArray(existing) ? existing : (existing ?? []);
          if (list.length > 0) return;
          await post("/checkins", {
            userId: checkin.userId,
            classId: checkin.classId,
            date: checkin.date ?? new Date().toISOString(),
          });
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao criar o checkin");
          throw error;
        }
      },
    });
  };

  const remove = () => {
    return useMutation({
      mutationFn: async (checkinId: number) => {
        try {
          const { data } = await del<any>(`/checkins/${checkinId}`);
          return data;
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao apagar o checkin");
          throw error;
        }
      },
    });
  };

  const fetchAll = (userId: number) => {
    return useQuery({
      queryKey: ["checkins", userId],
      queryFn: async () => {
        try {
          const { data } = await get<any>(`/checkins/user/${userId}`);
          const list = Array.isArray(data) ? data : (data ?? []);
          const today = new Date().toISOString().split("T")[0];
          return list.filter(
            (c: { date?: string }) => c?.date?.split?.("T")?.[0] === today,
          );
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
          throw error;
        }
      },
    });
  };

  const fetchAllByClassId = (classId: number, userId: number) => {
    return useQuery({
      queryKey: ["just-checkins-by-class-id", classId, userId],
      queryFn: async () => {
        try {
          const { data } = await get<any>(
            `/checkins/class/${classId}/user/${userId}`,
          );
          const list = Array.isArray(data) ? data : (data ?? []);
          const today = new Date().toISOString().split("T")[0];
          return list.filter(
            (c: { date?: string }) => c?.date?.split?.("T")?.[0] === today,
          );
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
          throw error;
        }
      },
    });
  };

  const fetchLastCheckins = (userId: number) => {
    return useQuery({
      queryKey: ["last-checkins", userId],
      queryFn: async () => {
        try {
          const { data } = await get<any>(`/checkins/user/${userId}/last`);
          return Array.isArray(data) ? data : (data ?? []);
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
          throw error;
        }
      },
    });
  };

  const fetchByClassId = (classId: number) => {
    return useQuery({
      queryKey: ["checkins-by-class-id", classId],
      queryFn: async () => {
        try {
          const { data } = await get<any>(`/checkins/class/${classId}`);
          return data;
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
          throw error;
        }
      },
    });
  };

  const fetchLastMonthCheckins = (userId: number) => {
    return useQuery({
      queryKey: ["last-month-checkins", userId],
      queryFn: async () => {
        try {
          const { data } = await get<any>(
            `/checkins/user/${userId}/last-month`,
          );
          return (Array.isArray(data) ? data : (data ?? [])) as Checkin[];
        } catch (error) {
          showErrorToast("Erro", "Ocorreu um erro ao buscar os checkins");
          throw error;
        }
      },
    });
  };

  return {
    create,
    fetchAll,
    remove,
    fetchByClassId,
    fetchLastCheckins,
    fetchLastMonthCheckins,
    fetchAllByClassId,
  };
}
