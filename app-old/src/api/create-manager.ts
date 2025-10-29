import axiosClient from "../lib/axios";

interface CreateManagerProps {
  form: Partial<{
    name: string;
    email: string;
    password: string;
    gender: string;
    tier: string;
    birth: string;
    authToken: string;
    // isInstructor: boolean;
    gymName: string;
    gymAddress: string;
    // customerId: string;
    gymSince: string;
    graduations: Partial<{
      colorId: string;
      modalityId: string;
      extraInfo: string;
    }>[];
  }>;
}

interface CreateManagerResponse {
  user: {
    id: string;
  };
  gym: {
    id: string;
  };
}

export default async function createManager({ form }: CreateManagerProps) {
  const response = await axiosClient.post<CreateManagerResponse>("/managers", form);
  return response.data;
}
