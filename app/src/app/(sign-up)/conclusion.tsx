import Icon from "@react-native-vector-icons/feather";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import createManager from "~/src/api/create-manager";
import uploadPhoto from "~/src/api/send-attachment";
import { Button } from "~/src/components/ui/button";
import { useSignUpContext } from "~/src/providers/sign-up-provider";
import { UserCreationFormSubmit } from "./user-creation";
import { GymCreationFormSubmit } from "./gym-creation";
import { GraduationCreationFormSubmit } from "./graduation-creation";
import { SubscriptionFormSubmit } from "./subscription";
import { UserType } from "~/src/constants/user-type";
import createInstructor from "~/src/api/create-instructor";
import createStudent from "~/src/api/create-student";
import { useAuthentication } from "~/src/providers/authentication-provider";
import authenticate from "~/src/api/authenticate";

export default function Conclusion() {
  const [loading, setLoading] = useState(true);
  const [congratulationsMessage, setCongratulationsMessage] = useState("");
  const router = useRouter();
  const { form, userType } = useSignUpContext<
    UserCreationFormSubmit &
      GymCreationFormSubmit &
      GraduationCreationFormSubmit &
      SubscriptionFormSubmit
  >();
  const { mutateAsync: uploadPhotoFn } = useMutation({
    mutationFn: uploadPhoto,
  });
  const { mutate: authenticateFn } = useMutation({
    mutationFn: authenticate,
    onSuccess: async (data) => {
      console.log("authenticateFn onSuccess");
      await signIn(data.accessToken, new Date(data.expiresIn));
      setLoading(false);
    },
    onError: (error) => {
      console.log(error.message);
      console.log("authenticateFn onError");
      setLoading(false);
    },
  });
  const { mutateAsync: createInstructorFn } = useMutation({
    mutationFn: createInstructor,
    onSuccess: () => {
      authenticateFn({
        email: form?.email ?? "",
        password: form?.password ?? "",
      });
    },
    onError: (error) => {
      console.log(error.message);
      router.back();
    },
  });
  const { mutateAsync: createStudentFn } = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      authenticateFn({
        email: form?.email ?? "",
        password: form?.password ?? "",
      });
    },
    onError: (error) => {
      console.log(error.message);
      router.back();
    },
  });
  const { mutateAsync: createManagerFn } = useMutation({
    mutationFn: createManager,
    onSuccess: () => {
      authenticateFn({
        email: form?.email ?? "",
        password: form?.password ?? "",
      });
    },
    onError: (error) => {
      console.log(error.message);
      router.back();
    },
  });
  const { signIn, isAuthenticated } = useAuthentication();

  useEffect(() => {
    const uploadPromises = [];
    if (form?.gymLogo && userType === UserType.MANAGER)
      uploadPromises.push(uploadPhotoFn({ photoUrl: form?.gymLogo }));
    if (form?.photo)
      uploadPromises.push(uploadPhotoFn({ photoUrl: form?.photo }));
    Promise.all(uploadPromises).then((data) => {
      let gymLogo, profilePhoto;
      if (userType === UserType.MANAGER) {
        [gymLogo, profilePhoto] = data;
      } else {
        [profilePhoto] = data;
      }

      let body: any = {
        name: form?.name,
        email: form?.email,
        password: form?.password,
        gender: form?.gender == "m" ? "MALE" : "FEMALE",
        tier: form?.plan,
        birth: form?.birthDate?.toISOString(),
        profilePhotoUrl: profilePhoto.url,
        authToken: "",
        graduations: form?.graduations?.map((graduation) => ({
          colorId: graduation.color,
          modalityId: graduation.modality,
          extraInfo: graduation.extras,
        })),
      };
      if (userType === UserType.MANAGER) {
        body = {
          ...body,
          customerId: form?.customerId,
          isInstructor: form?.isProfessor,
          gymName: form?.gymName,
          gymAddress: `${form?.gymStreet}, ${form?.gymAddressNumber}, ${form?.gymNeighborhood}, ${form?.gymCity} - ${form?.gymState}, ${form?.gymCep}`,
          gymLogo: gymLogo?.url,
          gymSince: form?.gymCreationDate?.toISOString(),
        };
        createManagerFn({ form: body });
        setCongratulationsMessage(
          "Agora você pode começar a gerenciar sua academia e elevar ainda mais o nível do seu negócio"
        );
      } else if (userType === UserType.INSTRUCTOR) {
        body = {
          ...body,
          gymId: form?.gymId,
        };
        createInstructorFn({ form: body });
        setCongratulationsMessage(
          "Agora você pode começar a gerenciar suas turmas e alunos"
        );
      } else if (userType === UserType.STUDENT) {
        body = {
          ...body,
          gymId: form?.gymId,
        };
        createStudentFn({ form: body });
        setCongratulationsMessage(
          "Agora você pode começar a acompanhar suas aulas"
        );
      }
    });
  }, []);

  function handleEnterDashboard() {
    if (isAuthenticated) router.replace("/(dashboard)/home");
    else router.replace("/login");
  }

  return (
    <View className="bg-neutral-900 flex-1">
      {loading && (
        <View className="flex flex-col items-center justify-center pt-[30%]">
          <ActivityIndicator size={90} color={"rgb(139 92 246)"} />
        </View>
      )}
      {!loading && (
        <View className="flex flex-col items-center justify-center pt-[30%]">
          <Icon
            className="text-center"
            name="check-circle"
            color={"rgb(139 92 246);"}
            size={90}
          />
          <Text className="font-sora-bold text-[28px] text-white text-center">
            PARABÉNS
          </Text>
          <Text className="font-sora text-[16px] text-neutral-400">
            {congratulationsMessage}
          </Text>
          <Button
            className="bg-violet-800 flex flex-row gap-2 mt-12"
            size={"lg"}
            onPress={handleEnterDashboard}
          >
            <Text className="font-sora-bold text-white text-[16px]">
              Começar
            </Text>
            <Icon name="arrow-right" color={"#ffffff"} size={18} />
          </Button>
        </View>
      )}
    </View>
  );
}
