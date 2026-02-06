import { useStripeHook } from "@/src/api/use-stripe-hook";
import ManagerPlan from "@/src/components/manager-plan";
import { Heading } from "@/src/components/ui/heading";
import { Skeleton } from "@/src/components/ui/skeleton";
import { VStack } from "@/src/components/ui/vstack";
import { useState } from "react";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ManagerPlanSelection() {
    const { fetchProducts } = useStripeHook();
    const { data: products, isLoading } = fetchProducts;
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    function handleSelectPlan(planId: string) {
        setSelectedPlan(planId);
    }

    return (
        <SafeAreaView className="flex-1 justify-start items-start pt-[80px]">
            {isLoading && (
                <VStack className="gap-4 w-full px-5">
                    <Skeleton className="w-full h-[40px] mb-4 rounded-md bg-neutral-800" />
                    <Skeleton className="w-full h-[200px] rounded-md bg-neutral-800" />
                    <Skeleton className="w-full h-[200px] rounded-md bg-neutral-800" />
                </VStack>
            )}
            {!isLoading && (
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
                                        firstMonthFree={Boolean(product.metadata.first_month_free)}
                                        isSelected={selectedPlan === product.id}
                                    />
                                </Pressable>
                            ))}
                </VStack>
            )}
        </SafeAreaView>
    );
}
