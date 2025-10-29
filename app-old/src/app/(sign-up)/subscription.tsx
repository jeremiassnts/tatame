import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormStageFooter from "~/src/components/form-stage-footer";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import ManagerSubscribePlan from "~/src/components/manager-subscribe-plan";
import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import fetchStripeProducts, {
  StripeProduct,
} from "~/src/api/fetch-stripe-products";
import { Skeleton } from "~/src/components/ui/skeleton";
import { createCustomer } from "~/src/api/create-stripe-customer";
import { createSubscription } from "~/src/api/create-stripe-subscription";
import { useSignUpContext } from "~/src/providers/sign-up-provider";
import { UserCreationFormSubmit } from "./user-creation";
import { GymCreationFormSubmit } from "./gym-creation";

const subscriptionFormSubmitSchema = z.object({
  plan: z.string().min(1, "O plano é obrigatório"),
  customerId: z.string(),
});
export type SubscriptionFormSubmit = z.infer<
  typeof subscriptionFormSubmitSchema
>;

export default function Subscription() {
  const router = useRouter();
  const [selectedPriceId, setSelectedPriceId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { handleUpdateForm, form, currentStep, stepsCount } = useSignUpContext<
    SubscriptionFormSubmit & UserCreationFormSubmit & GymCreationFormSubmit
  >();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { handleSubmit, setValue, watch, getValues } =
    useForm<SubscriptionFormSubmit>({
      resolver: zodResolver(subscriptionFormSubmitSchema),
      defaultValues: {
        plan: "",
        customerId: "",
      },
    });
  const { mutate: createCustomerFn } = useMutation({
    mutationFn: createCustomer,
    onSuccess: (data) => {
      setValue("customerId", data.customerId);
      handleUpdateForm(getValues());
      createSubscriptionFn({
        priceId: selectedPriceId,
        customerId: data.customerId,
      });
    },
    onError: () => {
      handleStripeError();
    },
  });

  const { mutate: createSubscriptionFn } = useMutation({
    mutationFn: createSubscription,
    onSuccess: async () => {
      router.navigate("/(sign-up)/conclusion");
    },
    onError: () => {
      handleStripeError();
    },
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["stripe-products"],
    queryFn: fetchStripeProducts,
  });

  async function handleCustomerCreation() {
    setIsLoading(true);
    //create customer
    createCustomerFn({
      email: form?.email,
      name: form?.name,
      address: {
        city: form?.gymCity,
        state: form?.gymState,
        postal_code: form?.gymCep,
        country: "BR",
        line1: form?.gymStreet,
      },
    });
  }

  function handleChangePlan(selectedPlan: StripeProduct | null) {
    if (selectedPlan) {
      setValue("plan", selectedPlan.id);
      setSelectedPriceId(selectedPlan.default_price.id);
    }
  }

  function handleStripeError() {
    Alert.alert(
      "Erro ao processar a assinatura",
      "Não foi possível processar a assinatura, tente novamente mais tarde",
      [
        {
          text: "Ok",
          style: "default",
          onPress: () => {
            setIsLoading(false);
          },
        },
      ]
    );
  }

  const plan = watch("plan");

  return (
    <KeyboardAvoidingView
      className="bg-neutral-900 flex-1"
      enabled={true}
      behavior="padding"
    >
      <View className="pt-4">
        <Text className="font-sora-bold text-white text-[20px]">
          Assinatura
        </Text>
        <Text className="font-sora text-neutral-400 text-[14px]">
          Selecione o plano que mais se encaixa com seu momento
        </Text>
      </View>
      {isLoadingProducts && (
        <View className="flex flex-col gap-2 mt-6">
          <Skeleton className="w-full h-[150px] rounded-sm" />
          <Skeleton className="w-full h-[150px] rounded-sm" />
          <Skeleton className="w-full h-[150px] rounded-sm" />
        </View>
      )}
      {!isLoadingProducts && (
        <ScrollView className="flex flex-col mt-2 h-full mb-20">
          {products
            ?.sort(
              (a, b) =>
                a.default_price.unit_amount - b.default_price.unit_amount
            )
            .map((product) => (
              <ManagerSubscribePlan
                key={product.id}
                title={product.name}
                description={product.description.split(";")[0]}
                items={
                  product.description.split(";")[1]
                    ? product.description.split(";")[1].split("-")
                    : []
                }
                selected={plan === product.id}
                price={product.default_price.unit_amount}
                onChangeSelected={() => handleChangePlan(product)}
                priceYear={product.default_price.unit_amount * 12}
                className="mt-2"
                currency={product.default_price.currency.toUpperCase()}
              />
            ))}
        </ScrollView>
      )}
      <FormStageFooter
        stage={currentStep}
        stageCount={stepsCount}
        handleSubmit={handleSubmit(handleCustomerCreation)}
        label={isLoading ? "Processando..." : "Finalizar"}
        enabled={!!plan && !isLoading}
      />
    </KeyboardAvoidingView>
  );
}
