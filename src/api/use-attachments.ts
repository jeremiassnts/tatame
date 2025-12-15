import { useMutation } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { useSupabase } from "../hooks/useSupabase";
import axiosClient from "../lib/axios";

export function useAttachments() {
  const supabase = useSupabase();
  const { showErrorToast } = useToast();

  const uploadImage = useMutation({
    mutationFn: async (image: string) => {
      if (!image) return;
      const formData = new FormData();

      const filename = image.split("/").pop();
      const match = /\.(\w+)$/.exec(filename ?? "");
      const ext = match?.[1];
      const mimeType = ext ? `image/${ext}` : `image`;

      formData.append("file", {
        uri: image,
        name: filename,
        type: mimeType,
      } as any);
      const response = await axiosClient.post<{ url: string }>(
        "/attachment-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        }
      );
      return response.data.url;
    },
  });

  const updateUserImage = useMutation({
    mutationFn: async (props: { image: string; userId: number }) => {
      console.log(props);
      const { image, userId } = props;
      if (!image) return;
      const formData = new FormData();

      const filename = image.split("/").pop();
      const match = /\.(\w+)$/.exec(filename ?? "");
      const ext = match?.[1];
      const mimeType = ext ? `image/${ext}` : `image`;

      formData.append("file", {
        uri: image,
        name: filename,
        type: mimeType,
      } as any);
      const response = await axiosClient.post<{ url: string }>(
        `/clerk-update-profile-image/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        }
      );
      return response.data;
    },
  });

  const updateGymLogo = useMutation({
    mutationFn: async (props: { logo: string; gymId: number }) => {
      const { logo, gymId } = props;
      const { data, error } = await supabase
        .from("gyms")
        .update({ logo })
        .eq("id", gymId);
      if (error) {
        showErrorToast(
          "Erro",
          "Ocorreu um erro ao atualizar a logo da academia"
        );
        throw error;
      }
      return data;
    },
  });

  return {
    uploadImage,
    updateUserImage,
    updateGymLogo,
  };
}
