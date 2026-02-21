import { useApi } from "@/src/hooks/use-api";
import { useMutation } from "@tanstack/react-query";

export function uploadImage() {
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
      const response = await post<{ data?: { url: string }; url?: string }>(
        "/attachments/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const body = response.data as any;
      return body?.data?.url ?? body?.url ?? body;
    },
  });
}
