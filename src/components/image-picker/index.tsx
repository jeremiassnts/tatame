import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Box } from "../ui/box";
import { VStack } from "../ui/vstack";
import { Icon, ImageIcon } from "../ui/icon";
import { Pressable } from "react-native";
import { Image } from "../ui/image";
import { Text } from "../ui/text";
import { Avatar, AvatarImage } from "../ui/avatar";

interface ImageViewerProps {
  placeholder: string;
  setRemoteImage: (image: string) => void;
  error?: string | undefined;
}

export default function ImageViewer({
  placeholder,
  setRemoteImage,
  error,
}: ImageViewerProps) {
  const [image, setImage] = useState<string | undefined>();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setRemoteImage(result.assets[0].uri);
    } else {
      setImage(undefined);
    }
  };

  return (
    <Pressable onPress={pickImage} className="w-full flex flex-column items-center justify-center">
      {image && (
        <Avatar size="xl">
          <AvatarImage alt="dynamic image" source={{ uri: image }} />
        </Avatar>
      )}
      {!image && (
        <VStack className="items-center justify-center">
          <Box className="bg-neutral-800 rounded-md p-10 items-center justify-center gap-2">
            <Icon as={ImageIcon} />
            <Text className="text-neutral-400 text-sm">{placeholder}</Text>
          </Box>
        </VStack>
      )}
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </Pressable>
  );
}
