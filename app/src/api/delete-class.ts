import axiosClient from "../lib/axios";

export async function deleteClass(id: string, token: string) {
  const response = await axiosClient.delete(`/classes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
