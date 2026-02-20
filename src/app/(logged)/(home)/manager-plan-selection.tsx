import { useStripeHook } from "@/src/api/stripe/use-stripe-hook";
import { useUsers } from "@/src/api/users/use-users";
import ManagerPlan from "@/src/components/manager-plan";
import { SplashScreen } from "@/src/components/splash-screen";
import { Button, ButtonSpinner, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Skeleton } from "@/src/components/ui/skeleton";
import { VStack } from "@/src/components/ui/vstack";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { queryClient } from "@/src/lib/react-query";
import { useStripe } from "@stripe/stripe-react-native";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ManagerPlanSelectionParams = {
    plan: string;
};

export default function ManagerPlanSelection() {
    const { plan } = useLocalSearchParams<ManagerPlanSelectionParams>();
    const stripeApi = useStripeHook();
    const { data: products, isLoading: isLoadingProducts } =
        stripeApi.products.list();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [isLoading, setIsLoading] = useState(false);
    const { update } = useUsers();
    const { mutateAsync: updateUser } = update();
    const { mutateAsync: createCustomer } = stripeApi.customers.create();
    const { mutateAsync: createSetupIntent } = stripeApi.setupIntents.create();
    const { mutateAsync: createSubscription } = stripeApi.subscriptions.create();
    const { mutateAsync: createEphemeralKey } = stripeApi.ephemeralKeys.create();
    const { user, isLoading: isLoadingUser } = useProfileContext();
    const { showErrorToast } = useToast();
    const router = useRouter();
    const mustSelectPlan = plan === "free";

    function handleSelectPlan(planId: string) {
        setSelectedPlan(planId);
    }

    async function handleContinue() {
        try {
            if (!selectedPlan) return;
            setIsLoading(true);
            const product = products?.find((product) => product.id === selectedPlan);
            if (product?.default_price.unit_amount! <= 0) {
                await updateUser({
                    id: user?.id ?? 0,
                    plan: product?.name?.toLowerCase(),
                    subscriptionId: null,
                    customerId: null,
                });
                queryClient.invalidateQueries({
                    queryKey: ["user-profile"],
                });
                router.navigate("/(logged)/(home)/home");
                return;
            } else {
                //create customer
                const customer = await createCustomer({
                    name: (user?.first_name + " " + (user?.last_name ?? "")).trim(),
                    email: user?.email ?? "",
                    userId: user?.id ?? 0,
                });
                //create payment intent
                const { client_secret: setupIntentSecret } = await createSetupIntent({
                    customerId: customer.id,
                });
                //create ephemeral key
                const { secret: ephemeralKey } = await createEphemeralKey({
                    customerId: customer.id,
                });
                //initialize payment sheet
                await setup(customer.id, ephemeralKey, setupIntentSecret);
                const { error } = await presentPaymentSheet();
                if (error) {
                    throw error;
                }
                //create subscription
                await createSubscription({
                    customerId: customer.id,
                    priceId: product?.default_price.id ?? "",
                    userId: user?.id ?? 0,
                });
                //save plan
                await updateUser({
                    id: user?.id ?? 0,
                    plan: product?.name?.toLowerCase(),
                });
                queryClient.invalidateQueries({
                    queryKey: ["user-profile"],
                });
                router.navigate("/(logged)/(home)/home");
            }
        } catch (error) {
            console.error(error);
            showErrorToast(
                "Erro na plataforma de pagamento",
                "Ocorreu um erro ao iniciar o pagamento, tente novamente.",
            );
        }
        setIsLoading(false);
    }

    const setup = async (
        customerId: string,
        ephemeralKey: string,
        setupIntentSecret: string,
    ) => {
        const { error } = await initPaymentSheet({
            merchantDisplayName: "Tatame",
            customerId,
            customerEphemeralKeySecret: ephemeralKey,
            setupIntentClientSecret: setupIntentSecret,
        });
        if (error) {
            throw error;
        }
    };

    useEffect(() => {
        if (plan && products) {
            const product = products.find(
                (product) => product.name.toLowerCase() === plan.toLowerCase(),
            );
            if (product) {
                setSelectedPlan(product.id);
            }
        }
    }, [plan, products]);

    if (isLoadingUser) {
        return <SplashScreen />;
    } else if (user?.plan && !mustSelectPlan) {
        return <Redirect href="/(logged)/(home)/home" />;
    }

    return (
        <SafeAreaView
            className={`flex-1 justify-start items-start ${plan ? "pt-0" : "pt-[60px]"} ${plan ? "pb-[60px]" : "pb-0"}`}
        >
            <ScrollView>
                {(isLoadingProducts || isLoadingUser) && (
                    <VStack className="gap-4 w-full px-5">
                        <Skeleton className="w-full h-[40px] mb-4 rounded-md bg-neutral-800" />
                        <Skeleton className="w-full h-[200px] rounded-md bg-neutral-800" />
                        <Skeleton className="w-full h-[200px] rounded-md bg-neutral-800" />
                    </VStack>
                )}
                {!isLoadingProducts && !isLoadingUser && (
                    <VStack className="gap-4 w-full px-5 justify-center items-center">
                        <Heading size="xl" className="text-neutral-200">
                            Selecione o plano de assinatura
                        </Heading>
                        {products &&
                            products
                                .sort(
                                    (a, b) =>
                                        a.default_price.unit_amount - b.default_price.unit_amount,
                                )
                                .map((product) => (
                                    <Pressable
                                        key={product.id}
                                        onPress={() => handleSelectPlan(product.id)}
                                    >
                                        <ManagerPlan
                                            title={product.name}
                                            description={product.description}
                                            price={product.default_price.unit_amount}
                                            currency={product.default_price.currency}
                                            features={
                                                (product.metadata.features as string).split(";") ?? []
                                            }
                                            firstMonthFree={
                                                (
                                                    product.metadata.first_month_free as string
                                                ).toUpperCase() === "TRUE"
                                            }
                                            isSelected={selectedPlan === product.id}
                                        />
                                    </Pressable>
                                ))}
                        <Button
                            variant="solid"
                            className="w-full bg-violet-500 disabled:opacity-50"
                            disabled={!selectedPlan || isLoading}
                            onPress={handleContinue}
                        >
                            {!isLoading && (
                                <ButtonText className="text-white text-md">
                                    Selecionar
                                </ButtonText>
                            )}
                            {isLoading && <ButtonSpinner color="white" />}
                        </Button>
                    </VStack>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
