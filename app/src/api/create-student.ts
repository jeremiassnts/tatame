import axiosClient from "../lib/axios";

interface CreateStudentProps {
  form: Partial<{
    name: string;
    email: string;
    password: string;
    gender: string;
    birth: string;
    profilePhotoUrl: string;
    authToken: string;
    gymId: string;
  }>;
}

export default async function createStudent({ form }: CreateStudentProps) {
  await axiosClient.post("/students", form);
}
