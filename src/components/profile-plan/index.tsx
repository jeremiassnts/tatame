import { useStripeHook } from "@/src/api/stripe/use-stripe-hook";
import { useProfileContext } from "@/src/hooks/use-profile-context";
import { Badge, BadgeText } from "../ui/badge";
import { Box } from "../ui/box";
import { Button, ButtonText } from "../ui/button";
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

    async function handleChangePaymentData() {
        console.log("change payment data");
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
            {!isLoading && subscription && (
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
                        <Button variant="solid" action="primary" className="w-full">
                            <ButtonText>Alterar dados de pagamento</ButtonText>
                        </Button>
                        <CancelButton
                            plan={user?.plan ?? ""}
                            subscriptionId={subscription.id}
                            userId={user?.id ?? 0}
                        />
                    </VStack>
                </Box>
            )}
        </Card>
    );
}
