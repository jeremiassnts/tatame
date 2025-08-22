import axiosClient from "../lib/axios";

interface UploadPhotoProps {
  photoUrl: string | undefined;
}

interface UploadPhotoResponse {
  url: string;
}

export default async function uploadPhoto({
  photoUrl,
}: UploadPhotoProps): Promise<UploadPhotoResponse> {
  if (!photoUrl)
    return {
      url: "",
    };
  const formData = new FormData();

  const filename = photoUrl.split("/").pop();
  const match = /\.(\w+)$/.exec(filename ?? "");
  const ext = match?.[1];
  const mimeType = ext ? `image/${ext}` : `image`;

  formData.append("file", {
    uri: photoUrl,
    name: filename,
    type: mimeType,
  } as any);

  try {
    const { data } = await axiosClient.post("/attachments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      url: data.url,
    };
  } catch (error) {
    console.log(error);
    return {
      url: "",
    };
  }
}
