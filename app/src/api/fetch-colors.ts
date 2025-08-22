import axiosClient from "../lib/axios";

interface FetchColorsProps {
    modality: string
}

interface Color {
    id: string
    name: string
    modalityId: string
    extraInfo: string
}

export default async function fetchColors({ modality }: FetchColorsProps) {
    if (!modality) return null
    const { data } = await axiosClient.get<{ colors: Color[] }>(`/modalities/${modality}/colors`)
    return data.colors
}