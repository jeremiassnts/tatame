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

function useProductsList() {
    const { get } = useApi();
    return useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const { data } = await get<FetchProductsResponse>("/stripe/products");
            return data;
        },
    });
}

function useCustomersCreate() {
    const { post } = useApi();
    return useMutation({
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
    });
}

function useSubscriptionGet(subscriptionId: string) {
    const { get } = useApi();
    return useQuery({
        queryKey: ["subscription-by-id", subscriptionId],
        queryFn: async () => {
            const { data } = await get<FetchSubscriptionResponse>(
                `/stripe/subscriptions/${subscriptionId}`,
            );
            return data ?? null;
        },
    });
}

function useSubscriptionCreate() {
    const { post } = useApi();
    return useMutation({
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
    });
}

function useSubscriptionGetByCustomerId(customerId: string) {
    const { get } = useApi();
    return useQuery({
        queryKey: ["subscription-by-customer-id", customerId],
        queryFn: async () => {
            const { data } = await get<FetchSubscriptionResponse>(
                `/stripe/subscriptions/customer/${customerId}`,
            );
            return data ?? null;
        },
    });
}

function useSubscriptionDelete() {
    const { del } = useApi();
    return useMutation({
        mutationFn: async ({ subscriptionId }: { subscriptionId: string }) => {
            const { data } = await del<DeleteSubscriptionResponse>(
                `/stripe/subscriptions/${subscriptionId}`,
            );
            return data;
        },
    });
}

function usePaymentIntentsCreate() {
    const { post } = useApi();
    return useMutation({
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
    });
}

function useSetupIntentsCreate() {
    const { post } = useApi();
    return useMutation({
        mutationFn: async ({ customerId }: { customerId: string }) => {
            const { data } = await post<CreateSetupIntentResponse>(
                "/stripe/setup-intents",
                { customerId },
            );
            return data;
        },
    });
}

function useEphemeralKeysCreate() {
    const { post } = useApi();
    return useMutation({
        mutationFn: async ({ customerId }: { customerId: string }) => {
            const { data } = await post<CreateEphemeralKeyResponse>(
                "/stripe/ephemeral-keys",
                { customerId },
            );
            return data;
        },
    });
}

export function useStripeHook() {
    const productsListResult = useProductsList();
    const customersCreateResult = useCustomersCreate();
    const subscriptionCreateResult = useSubscriptionCreate();
    const subscriptionDeleteResult = useSubscriptionDelete();
    const paymentIntentsCreateResult = usePaymentIntentsCreate();
    const setupIntentsCreateResult = useSetupIntentsCreate();
    const ephemeralKeysCreateResult = useEphemeralKeysCreate();

    return {
        products: {
            list: () => productsListResult,
        },
        customers: {
            create: () => customersCreateResult,
        },
        subscriptions: {
            get: useSubscriptionGet,
            create: () => subscriptionCreateResult,
            getByCustomerId: useSubscriptionGetByCustomerId,
            delete: () => subscriptionDeleteResult,
        },
        paymentIntents: {
            create: () => paymentIntentsCreateResult,
        },
        setupIntents: {
            create: () => setupIntentsCreateResult,
        },
        ephemeralKeys: {
            create: () => ephemeralKeysCreateResult,
        },
    };
}
