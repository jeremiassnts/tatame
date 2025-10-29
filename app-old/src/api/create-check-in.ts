import axiosClient from "../lib/axios";

interface CreateCheckInProps {
  classId: string;
  referenceDate: Date;
  token: string;
}

export async function createCheckIn({ classId, referenceDate, token }: CreateCheckInProps) {
  await axiosClient.post('/check-ins', 
    {
      classId,
      referenceDate,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}