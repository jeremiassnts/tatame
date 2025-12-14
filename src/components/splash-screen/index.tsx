import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "../ui/image";

export function SplashScreen() {
    return (
        <SafeAreaView className="bg-[#141414] flex items-center justify-center flex-1">
            <Image
                source={{
                    uri: require("@/assets/images/splash-icon-dark.png"),
                }}
                alt="logo"
                className="w-[200px] h-[200px]"
                resizeMode="contain"
            />
        </SafeAreaView>
    )
}