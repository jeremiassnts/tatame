import { useApi } from "@/src/hooks/use-api";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../hooks/use-toast";

export function useAttachments() {
  const { showErrorToast } = useToast();
  const { post, put } = useApi();

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
      const response = await post<{ data?: { url: string }; url?: string }>(
        "/attachments/image",
        formData,
        {
          "Content-Type": "multipart/form-data",
        },
      );
      const body = response.data as any;
      return body?.data?.url ?? body?.url ?? body;
    },
  });

  // const uploadVideo = useMutation({
  //   mutationFn: async (video: string) => {
  //     if (!video) return;
  //     const formData = new FormData();
  //     const filename = video.split("/").pop();
  //     const match = /\.(\w+)$/.exec(filename ?? "");
  //     const ext = match?.[1];
  //     const mimeType = ext ? `video/${ext}` : `video`;
  //     formData.append("file", {
  //       uri: video,
  //       name: filename,
  //       type: mimeType,
  //     } as any);
  //     const response = await axiosClient.post<{ url: string }>(
  //       "/attachment-video",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
  //         },
  //       },
  //     );
  //     return response.data.url;
  //   },
  // });

  const updateUserImage = useMutation({
    mutationFn: async (props: { image: string; userId: string }) => {
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
      const response = await post<{
        data?: { image_url?: string };
        image_url?: string;
      }>(`/users/clerk/${userId}/profile-image`, formData, {
        "Content-Type": "multipart/form-data",
      });
      const body = response.data as any;
      return body?.data ?? body;
    },
  });

  const updateGymLogo = useMutation({
    mutationFn: async ({ logo, gymId }: { logo: string; gymId: number }) => {
      try {
        await put<any>(`/gyms/${gymId}`, { logo });
      } catch (error) {
        showErrorToast(
          "Erro",
          "Ocorreu um erro ao atualizar a logo da academia",
        );
        throw error;
      }
    },
  });

  return {
    uploadImage,
    updateUserImage,
    updateGymLogo,
  };
}
