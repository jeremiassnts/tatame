import { DayOfWeek } from "../constants/week-days";
import axiosClient from "../lib/axios";

interface CreateClassesProps {
  data: {
    name: string;
    description: string;
    timeStart: Date;
    timeEnd: Date;
    daysOfWeek: DayOfWeek[];
    address: string;
    gymId: string;
    userId: string;
    modalityId: string;
  };
  token: string;
}

export async function createClasses({ data, token }: CreateClassesProps) {
  await axiosClient.post("/classes", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
