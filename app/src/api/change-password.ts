import axiosClient from "../lib/axios";

interface RequestChangePasswordProps {
  email: string;
}

export default async function requestChangePassword({
  email,
}: RequestChangePasswordProps) {
  await axiosClient.post("/users/request-change-password", { email });
}
