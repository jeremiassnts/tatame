import { useStripeHook } from "@/src/api/stripe/use-stripe-hook";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { useToast } from "@/src/hooks/use-toast";
import { useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Badge, BadgeText } from "../ui/badge";
import { Box } from "../ui/box";
import { Button, ButtonSpinner, ButtonText } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { CancelButton } from "./cancel-button";

export function ProfilePlan() {
    const stripeApi = useStripeHook();
    const { user, isLoading: isLoadingProfile } = useProfileContext();
    const { data: subscription, isLoading: isLoadingSubscription } =
        stripeApi.subscriptions.get(user?.subscription_id ?? "");
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { showErrorToast, showSuccessToast } = useToast();
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
    const router = useRouter();

    async function handleChangePaymentData() {
        try {
            if (!user?.customer_id) {
                showErrorToast(
                    "Erro",
                    "Não foi possível identificar seus dados de pagamento.",
                );
                return;
            }
            setIsUpdatingPayment(true);
            // Criar Setup Intent para o customer existente
            const { client_secret: setupIntentSecret } =
                await stripeApi.setupIntents.create.mutateAsync({
                    customerId: user.customer_id,
                });
            // Criar Ephemeral Key
            const { secret: ephemeralKey } =
                await stripeApi.ephemeralKeys.create.mutateAsync({
                    customerId: user.customer_id,
                });
            // Inicializar Payment Sheet
            const { error: initError } = await initPaymentSheet({
                merchantDisplayName: "Tatame",
                customerId: user.customer_id,
                customerEphemeralKeySecret: ephemeralKey,
                setupIntentClientSecret: setupIntentSecret,
            });
            if (initError) {
                throw initError;
            }
            // Apresentar Payment Sheet
            const { error: presentError } = await presentPaymentSheet();
            if (presentError) {
                throw presentError;
            }
            showSuccessToast(
                "Sucesso",
                "Dados de pagamento atualizados com sucesso!",
            );
        } catch (error) {
            console.log(JSON.stringify(error, null, 2));
            showErrorToast(
                "Erro na plataforma de pagamento",
                "Ocorreu um erro ao atualizar os dados de pagamento, tente novamente.",
            );
        } finally {
            setIsUpdatingPayment(false);
        }
    }

    function handleViewPlans() {
        router.navigate({
            pathname: "/(logged)/(home)/manager-plan-selection",
            params: {
                plan: "free",
            },
        });
    }

    const isLoading = isLoadingProfile || isLoadingSubscription;
    return (
        <Card className="w-full border-2 border-neutral-800 mt-4 bg-neutral-900">
            <HStack className="justify-between items-center">
                <Heading size="xs" className="text-neutral-400">
                    Plano
                </Heading>
            </HStack>
            {isLoading && (
                <Skeleton className="w-full h-[100px] mt-4 rounded-md bg-neutral-800" />
            )}
            {!isLoading && subscription && user && user.plan !== "free" && (
                <Box className="pt-4">
                    <HStack className="justify-between items-center">
                        <VStack className="gap-0 items-start justify-start">
                            <Heading size="xl">{user?.plan?.toUpperCase()}</Heading>
                            <Text>
                                {subscription.currency.toUpperCase()} $
                                {(subscription.plan.amount / 100).toFixed(2)}
                            </Text>
                        </VStack>
                        <Badge
                            size="lg"
                            className={`${subscription.plan.active ? "bg-green-800" : "bg-red-800"}`}
                        >
                            <BadgeText>
                                {subscription.plan.active ? "Ativo" : "Inativo"}
                            </BadgeText>
                        </Badge>
                    </HStack>
                    <HStack className="justify-between items-center mt-4">
                        <Text className="text-neutral-400">Próximo pagamento:</Text>
                        <Text>
                            {new Date(
                                subscription.current_period_end * 1000,
                            ).toLocaleDateString()}
                        </Text>
                    </HStack>
                    <HStack className="justify-between items-center">
                        <Text className="text-neutral-400">Último pagamento:</Text>
                        <Text>
                            {new Date(
                                subscription.current_period_start * 1000,
                            ).toLocaleDateString()}
                        </Text>
                    </HStack>
                    <VStack className="mt-4 w-[70%] gap-2 mx-auto">
                        <Button
                            variant="solid"
                            action="primary"
                            className="w-full"
                            onPress={handleChangePaymentData}
                            disabled={isUpdatingPayment}
                        >
                            {!isUpdatingPayment && (
                                <ButtonText>Alterar dados de pagamento</ButtonText>
                            )}
                            {isUpdatingPayment && <ButtonSpinner />}
                        </Button>
                        <CancelButton
                            plan={user?.plan ?? ""}
                            subscriptionId={subscription.id}
                            userId={user?.id ?? 0}
                        />
                    </VStack>
                </Box>
            )}
            {!isLoading && user && user.plan === "free" && (
                <Box className="pt-4">
                    <HStack className="justify-between items-center">
                        <VStack className="gap-0 items-start justify-start">
                            <Heading size="xl">{user?.plan?.toUpperCase()}</Heading>
                            <Text>Grátis</Text>
                        </VStack>
                        <Badge size="lg" className="bg-green-800">
                            <BadgeText>Ativo</BadgeText>
                        </Badge>
                    </HStack>
                    <Button
                        variant="solid"
                        action="primary"
                        className="w-full mt-4"
                        onPress={handleViewPlans}
                    >
                        <ButtonText>Ver planos</ButtonText>
                    </Button>
                </Box>
            )}
        </Card>
    );
}
