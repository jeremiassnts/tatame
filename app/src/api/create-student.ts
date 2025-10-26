import axiosClient from "../lib/axios";

interface CreateStudentProps {
  form: Partial<{
    name: string;
    email: string;
    password: string;
    gender: string;
    birth: string;
    authToken: string;
    gymId: string;
  }>;
}

interface CreateStudentResponse {
  user: {
    id: string;
  };
}

export default async function createStudent({ form }: CreateStudentProps) {
  const response = await axiosClient.post<CreateStudentResponse>("/students", form);
  return response.data;
}
