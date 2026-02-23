import { useApi } from "@/src/hooks/use-api";
import { useMutation } from "@tanstack/react-query";

interface UploadImageResponse {
  data: { url: string };
}

export function useUploadImage() {
  const { post } = useApi();

  return useMutation({
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
      const { data } = await post<UploadImageResponse>(
        "/attachments/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data.url;
    },
  });
}
