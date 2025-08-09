import axiosClient from "../lib/axios";

interface Modality {
    id: string
    name: string
    type: string
}

export default async function fetchModalities() {
    const { data } = await axiosClient.get<{ modalities: Modality[] }>("/modalities");
    return data.modalities
}