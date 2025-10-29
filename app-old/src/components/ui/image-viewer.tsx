import { useState } from "react";
import { Image, Pressable, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ErrorLabel from "./error-label";

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
    <Pressable onPress={pickImage}>
      <Image
        source={
          !image
            ? require("~/assets/images/default.png")
            : {
                uri: image,
                width: 90,
                height: 75,
              }
        }
        className="self-center mt-3 w-[90px] h-[75px] rounded-md"
        resizeMode="contain"
      />
      <Text className="font-sora text-[16px] w-full bg-neutral-800 p-3 pl-4 pr-4 text-neutral-400 rounded-md mt-2">
        {image ? "Imagem selecionada" : placeholder}
      </Text>
      <ErrorLabel error={error} />
    </Pressable>
  );
}
