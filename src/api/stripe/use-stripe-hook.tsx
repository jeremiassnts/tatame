import { useApi } from "@/src/hooks/use-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    CreateCustomerResponse,
    CreateEphemeralKeyResponse,
    CreatePaymentIntentResponse,
    CreateSetupIntentResponse,
    CreateSubscriptionResponse,
    DeleteSubscriptionResponse,
    FetchProductsResponse,
    FetchSubscriptionResponse,
} from "./types";

export function useStripeHook() {
    const { get, post, del } = useApi();

    const products = {
        list: useQuery({
            queryKey: ["products"],
            queryFn: async () => {
                const { data } = await get<FetchProductsResponse>("/stripe/products");
                return data;
            },
        }),
    };

    const customers = {
        create: useMutation({
            mutationFn: async ({
                name,
                email,
                userId,
            }: {
                name: string;
                email: string;
                userId: number;
            }) => {
                const { data } = await post<CreateCustomerResponse>(
                    "/stripe/customers",
                    { name, email, userId },
                );
                return data;
            },
        }),
    };

    const subscriptions = {
        get: (subscriptionId: string) =>
            useQuery({
                queryKey: ["subscription-by-id"],
                queryFn: async () => {
                    const { data } = await get<FetchSubscriptionResponse>(
                        `/stripe/subscriptions/${subscriptionId}`,
                    );
                    return data ?? null;
                },
            }),
        create: useMutation({
            mutationFn: async ({
                customerId,
                priceId,
                userId,
            }: {
                customerId: string;
                priceId: string;
                userId: number;
            }) => {
                const { data } = await post<CreateSubscriptionResponse>(
                    "/stripe/subscriptions",
                    { customerId, priceId, userId },
                );
                return data;
            },
        }),
        getByCustomerId: (customerId: string) =>
            useQuery({
                queryKey: ["subscription-by-customer-id"],
                queryFn: async () => {
                    const { data } = await get<FetchSubscriptionResponse>(
                        `/stripe/subscriptions/customer/${customerId}`,
                    );
                    return data ?? null;
                },
            }),
        delete: useMutation({
            mutationFn: async ({ subscriptionId }: { subscriptionId: string }) => {
                const { data } = await del<DeleteSubscriptionResponse>(
                    `/stripe/subscriptions/${subscriptionId}`,
                );
                return data;
            },
        }),
    };

    const paymentIntents = {
        create: useMutation({
            mutationFn: async ({
                customerId,
                amount,
                currency,
            }: {
                customerId: string;
                amount: number;
                currency: string;
            }) => {
                const { data } = await post<CreatePaymentIntentResponse>(
                    "/stripe/payment-intents",
                    { customerId, amount, currency },
                );
                return data;
            },
        }),
    };

    const setupIntents = {
        create: useMutation({
            mutationFn: async ({ customerId }: { customerId: string }) => {
                const { data } = await post<CreateSetupIntentResponse>(
                    "/stripe/setup-intents",
                    { customerId },
                );
                return data;
            },
        }),
    };

    const ephemeralKeys = {
        create: useMutation({
            mutationFn: async ({ customerId }: { customerId: string }) => {
                const { data } = await post<CreateEphemeralKeyResponse>(
                    "/stripe/ephemeral-keys",
                    { customerId },
                );
                return data;
            },
        }),
    };

    return {
        products,
        customers,
        subscriptions,
        paymentIntents,
        setupIntents,
        ephemeralKeys,
    };
}
