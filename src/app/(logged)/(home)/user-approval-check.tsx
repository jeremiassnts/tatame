import { useUsers } from "@/src/api/use-users";
import { SplashScreen } from "@/src/components/splash-screen";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Image } from "@/src/components/ui/image";
import { Text } from "@/src/components/ui/text";
import { Redirect, useRouter } from "expo-router";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserApprovalCheck() {
    const router = useRouter();
    const { getStudentsApprovalStatus } = useUsers();
    const { data: studentsApprovalStatus,
        isLoading: isLoadingStudentsApprovalStatus,
        refetch: refetchStudentsApprovalStatus
    } = getStudentsApprovalStatus

    if (isLoadingStudentsApprovalStatus) {
        return <SplashScreen />
    }
    if (studentsApprovalStatus) {
        return <Redirect href="/(logged)/(home)/home" />
    }

    return (
        <SafeAreaView className="flex-1 pt-[100px]">
            <ScrollView className="pl-10 pr-10"
                refreshControl={<RefreshControl refreshing={isLoadingStudentsApprovalStatus} onRefresh={refetchStudentsApprovalStatus} />}>
                <Image
                    source={require("@/assets/images/logo.png")}
                    className="w-[200px] mt-[-10px] mb-[-5px] mx-auto"
                    resizeMode="contain"
                    alt="Tatame Logo"
                />
                <Heading size="xl" className="text-center mt-6 mb-2">Falta pouco! Você selecionou sua academia com sucesso!</Heading>
                <Text className="text-center text-neutral-200">
                    Agora é só aguardar a aprovação do seu professor para usar todas as funcionalidades da plataforma.
                </Text>
                <Button
                    action="primary"
                    onPress={() => router.replace("/(logged)/(home)/home")}
                    className="bg-violet-800 mt-6"
                >
                    <ButtonText className="text-white">Voltar para o início</ButtonText>
                </Button>
            </ScrollView>
        </SafeAreaView>
    )
}