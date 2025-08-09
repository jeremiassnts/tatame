import axiosClient from "../lib/axios";
import { Class } from "./fetch-classes";

export async function fetchClass(classId: string, token: string) {
  const { data } = await axiosClient.get(`/classes/${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.class as Class;
}
