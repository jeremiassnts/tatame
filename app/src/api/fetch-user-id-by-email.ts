import axiosClient from "../lib/axios";

export default async function fetchUserIdByEmail(email: string) {
  const { data } = await axiosClient.get<{ userId: string }>(
    `/users/check-email?email=${email}`
  );
  return data.userId;
}
