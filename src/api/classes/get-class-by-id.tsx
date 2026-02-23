import { useApi } from "@/src/hooks/use-api";
import { useToast } from "@/src/hooks/use-toast";
import { Class, Gym } from "@/src/types/models";

export type ClassDetails = {
  instructorName: string;
  gym: Gym;
} & Class;
export interface GetClassByIdProps {
  data: ClassDetails;
}

export function useGetClassById() {
  const { get } = useApi();
  const { showErrorToast } = useToast();

  return async (classId: number) => {
    try {
      const { data } = await get<GetClassByIdProps>(`/class/${classId}`);
      if (!data) return null;
      return data;
    } catch (error) {
      showErrorToast("Erro", "Ocorreu um erro ao buscar a aula");
      throw error;
    }
  };
}
