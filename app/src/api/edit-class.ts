import { DayOfWeek } from "../constants/week-days";
import axiosClient from "../lib/axios";

interface EditClassProps {
  data: {
    name: string;
    description: string;
    timeStart: Date;
    timeEnd: Date;
    dayOfWeek: DayOfWeek;
    address: string;
    gymId: string;
    userId: string;
    modalityId: string;
    id: string;
  };
  token: string;
}

export async function editClass({ data, token }: EditClassProps) {
  await axiosClient.put(`/classes/${data.id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
