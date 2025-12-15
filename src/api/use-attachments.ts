import { useMutation } from "@tanstack/react-query";
import axiosClient from "../lib/axios";

export function useAttachments() {
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

  return {
    uploadImage,
    updateUserImage,
  };
}
