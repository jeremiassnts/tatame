import axiosClient from "../lib/axios";

interface CreateManagerProps {
  form: Partial<{
    name: string;
    email: string;
    password: string;
    gender: string;
    tier: string;
    birth: string;
    profilePhotoUrl: string;
    authToken: string;
    // isInstructor: boolean;
    gymName: string;
    gymAddress: string;
    gymLogo: string;
    // customerId: string;
    gymSince: string;
    graduations: Partial<{
      colorId: string;
      modalityId: string;
      extraInfo: string;
    }>[];
  }>;
}

export default async function createManager({ form }: CreateManagerProps) {
  await axiosClient.post("/managers", form);
}
