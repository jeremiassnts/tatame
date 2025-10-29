import { ImageBackground, View, Text, Image, ScrollView } from "react-native";
import UserTypePressable from "../components/user-card-pressable";
import { useState } from "react";
import { Button } from "~/src/components/ui/button";
import { UserType } from "../constants/user-type";
import { router } from "expo-router";
import { useUserType } from "../providers/user-type-provider";

export default function UserTypeSelection() {
  const [userType, setUserType] = useState<UserType>();
  const { selectUserType } = useUserType();

  function handleUserType(user: UserType) {
    if (userType === user) {
      setUserType(undefined);
    } else {
      setUserType(user);
    }
  }
  function handleStart() {
    if (!userType) {
      return;
    }
    selectUserType(userType);
    router.replace(`/login`);
  }
  return (
    <ImageBackground
      source={require("~/assets/images/home-bg.png")}
      resizeMode="cover"
      className="w-full h-full"
    >
      <View className="flex items-center w-full pt-[40%] pl-6 pr-6 gap-1 mb-1">
        <Text className="text-neutral-400 text-[16px] font-sora">
          Bem vindo ao
        </Text>
        <Image
          source={require("~/assets/images/tatame-logo.png")}
          className="w-[230px]"
          resizeMode="contain"
        />
        <Text className="text-neutral-400 text-[14px] text-center font-sora">
          Selecione o tipo de acesso abaixo e comece já a usar a plataforma
        </Text>
      </View>
      <ScrollView className="h-full mb-20">
        <View className="pl-6 pr-6 mt-7 flex flex-col gap-3 justify-center items-start">
          <UserTypePressable
            title="Aluno"
            description="Acompanhe as aulas, conteúdos e faça check-in para marcar sua presença"
            active={userType === "student"}
            onPress={() => handleUserType(UserType.STUDENT)}
            icon="user"
          />
          {/* <UserTypePressable
            title="Professor"
            description="Gerencie suas aulas, turmas e conteúdos"
            active={userType === "instructor"}
            onPress={() => handleUserType(UserType.INSTRUCTOR)}
            icon="book"
          /> */}
          <UserTypePressable
            title="Gestor"
            description="Tenha acompanhamento financeiro completo e gerencie suas turmas com alunos e professores"
            active={userType === "manager"}
            onPress={() => handleUserType(UserType.MANAGER)}
            icon="briefcase"
          />
          <Button
            size={"lg"}
            className="w-full bg-violet-800 border-[1px] disabled:bg-transparent disabled:border-stone-700"
            disabled={!userType}
            onPress={handleStart}
          >
            <Text className="text-[18px] text-white text-center font-sora-bold">
              Começar
            </Text>
          </Button>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
