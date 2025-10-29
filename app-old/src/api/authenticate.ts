import axiosClient from "../lib/axios";

interface AuthenticateProps {
  email: string;
  password: string;
}

export default async function authenticate({
  email,
  password,
}: AuthenticateProps) {
  const response = await axiosClient.post<{
    accessToken: string;
    expiresIn: Date;
  }>("/sessions", {
    email,
    password,
  });
  return response.data;
}
