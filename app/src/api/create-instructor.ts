import axiosClient from "../lib/axios";

interface CreateInstructorProps {
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

export default async function createInstructor({
  form,
}: CreateInstructorProps) {
  await axiosClient.post("/instructors", form);
}
