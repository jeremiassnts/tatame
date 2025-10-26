import axiosClient from "../lib/axios";

interface SendGymPhotoProps {
  photoUrl: string | undefined;
  gymId: string;
}

export default async function sendGymPhoto({
  photoUrl,
  gymId,
}: SendGymPhotoProps): Promise<void> {
  if (!photoUrl)
    return;
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

  await axiosClient.post(`/attachments/${gymId}/gym`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
