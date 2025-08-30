import axiosClient from "../lib/axios";

interface UncancelClassProps {
  classId: string;
  token: string;
  referenceDate: string;
}

export default async function uncancelClass({
  classId,
  token,
  referenceDate,
}: UncancelClassProps) {
  try {
    await axiosClient.post(
      `/classes/uncancel`,
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
