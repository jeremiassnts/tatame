import * as Application from "expo-application";
import * as Linking from 'expo-linking';
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { Image } from "../ui/image";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface VersionAlertProps {
    lastVersion: string;
}
export function VersionAlert({ lastVersion }: VersionAlertProps) {
    const googlePlayAppLink = process.env.EXPO_PUBLIC_GOOGLE_PLAY_APP_LINK;
    function handleUpdateVersion() {
        Linking.openURL(googlePlayAppLink as string);
    }
    return (
        <SafeAreaView className="bg-[#141414] flex items-center justify-center flex-1">
            <VStack className="justify-center items-center gap-1 p-10">
                <Image
                    source={{
                        uri: require("@/assets/images/splash-icon-dark.png"),
                    }}
                    alt="logo"
                    className="w-[120px] h-[120px]"
                    resizeMode="contain"
                />
                <Heading size="2xl" className="text-center">
                    Versão obsoleta
                </Heading>
                <Text className="text-center">
                    Por favor, atualize o aplicativo para a versão mais recente. (versão atual: {Application.nativeApplicationVersion}) (versão necessária: {lastVersion})
                </Text>
                <Button
                    className="mt-4 bg-violet-700"
                    size="md"
                    onPress={handleUpdateVersion}
                >
                    <ButtonText className="text-white">
                        Atualizar
                    </ButtonText>
                </Button>
            </VStack>
        </SafeAreaView>
    )
}