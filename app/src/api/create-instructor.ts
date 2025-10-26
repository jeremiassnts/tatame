import axiosClient from "../lib/axios";

interface CreateInstructorProps {
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

interface CreateInstructorResponse {
  user: {
    id: string;
  };
}
export default async function createInstructor({
  form,
}: CreateInstructorProps) {
  const response = await axiosClient.post<CreateInstructorResponse>("/instructors", form);
  return response.data;
}
