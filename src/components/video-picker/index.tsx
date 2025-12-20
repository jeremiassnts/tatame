import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Pressable } from "react-native";
import { Box } from "../ui/box";
import { Icon, PlayIcon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface VideoPickerProps {
    setRemoteVideo: (video: string) => void;
    placeholder: string;
    error?: string | undefined;
}

export default function VideoPicker({ setRemoteVideo, placeholder, error }: VideoPickerProps) {
    const [video, setVideo] = useState<string | undefined>();

    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["videos"],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setVideo(result.assets[0].fileName ?? '');
            setRemoteVideo(result.assets[0].uri);
        } else {
            setVideo(undefined);
        }
    };
    return (
        <Pressable onPress={pickVideo} className="w-full flex flex-column items-center justify-center">
            <VStack className="items-center justify-center w-full">
                <Box className="bg-neutral-800 rounded-md p-10 items-center justify-center gap-2 w-full">
                    <Icon as={PlayIcon} />
                    <Text className="text-neutral-400 text-sm">{video ? video : placeholder}</Text>
                </Box>
            </VStack>
            {error && <Text className="text-red-500 text-sm">{error}</Text>}
        </Pressable>
    )
}