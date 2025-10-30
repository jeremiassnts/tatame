import { Image } from "../components/ui/image";
import { ImageBackground, View } from "react-native";
import { Text } from "../components/ui/text";
import { Heading } from "../components/ui/heading";
import { Button, ButtonIcon, ButtonText } from "../components/ui/button";
import { AppleIcon, GoogleIcon } from "../components/ui/icon";

export default function Login() {
  return (
    <ImageBackground
      source={require("../../assets/images/home-bg.png")}
      resizeMode="cover"
      className="flex flex-1 items-center justify-end"
    >
      <Image
        source={{
          uri: require("../../assets/images/logo.png"),
        }}
        alt="logo"
        className="w-[200px]"
        resizeMode="contain"
      />
      <View className="bg-neutral-900 rounded-t-xl p-8 h-[45%] mt-8">
        <Heading size="2xl">Comece agora</Heading>
        <Text className="text-neutral-400 text-md mt-1">
          Entre em sua conta para acompanhar suas aulas ou gerenciar sua
          academia
        </Text>
        <Button className="mt-6 h-14 rounded-md">
          <ButtonIcon as={GoogleIcon} size="md" />
          <ButtonText className="text-neutral-900">
            Entrar com google
          </ButtonText>
        </Button>
        <Button className="mt-4 h-14 rounded-md">
          <ButtonIcon as={AppleIcon} size="md" />
          <ButtonText className="text-neutral-900">
            Entrar com apple
          </ButtonText>
        </Button>
      </View>
    </ImageBackground>
  );
}
