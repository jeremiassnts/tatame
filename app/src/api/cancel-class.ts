import axiosClient from "../lib/axios";

interface CancelClassProps {
  classId: string;
  token: string;
  referenceDate: string;
}

export default async function cancelClass({
  classId,
  token,
  referenceDate,
}: CancelClassProps) {
  try {
    await axiosClient.post(
      `/classes/cancel`,
      {
        referenceDate,
        classId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: any) {
    console.log(JSON.stringify(error.response?.data));
    throw error;
  }
}
