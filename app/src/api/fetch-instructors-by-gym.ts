import axiosClient from "../lib/axios";

export interface Instructor {
  id: string;
  name: string;
  email: string;
}

export async function fetchInstructorsByGym(
  gymId: string,
  accessToken: string
) {
  const { data } = await axiosClient.get<{ instructors: Instructor[] }>(
    `/gyms/${gymId}/instructors`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return data.instructors;
}
