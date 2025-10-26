import axiosClient from "../lib/axios";

interface SendUserProfilePhotoProps {
  photoUrl: string | undefined;
  userId: string;
}

export default async function sendUserProfilePhoto({
  photoUrl,
  userId,
}: SendUserProfilePhotoProps): Promise<void> {
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

  await axiosClient.post(`/attachments/${userId}/user`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
