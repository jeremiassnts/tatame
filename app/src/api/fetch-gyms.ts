import axiosClient from "../lib/axios";

export interface Gym {
  id: string;
  name: string;
  address: string;
  logo: string;
  since: string;
  managerId: string;
}

export default async function fetchGyms() {
  const { data } = await axiosClient.get<{ gyms: Gym[] }>("/gyms");
  return data.gyms;
}
