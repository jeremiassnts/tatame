import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import tatameClient from "../../lib/tatame-api";
import {
    CreateCustomerResponse,
    CreateEphemeralKeyResponse,
    CreatePaymentIntentResponse,
    CreateSetupIntentResponse,
    CreateSubscriptionResponse,
    FetchProductsResponse,
} from "./types";

export function useStripeHook() {
    const { getToken } = useAuth();

    const products = {
        list: useQuery({
            queryKey: ["products"],
            queryFn: async () => {
                const token = await getToken();
                const response = await tatameClient.get<FetchProductsResponse>(
                    "/stripe/products",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                return response.data.data;
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
                const token = await getToken();
                const response = await tatameClient.post<CreateCustomerResponse>(
                    "/stripe/customers",
                    {
                        name,
                        email,
                        userId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                return response.data.data;
            },
        }),
    };

    const subscriptions = {
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
                const token = await getToken();
                const response = await tatameClient.post<CreateSubscriptionResponse>(
                    "/stripe/subscriptions",
                    { customerId, priceId, userId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                return response.data.data;
            },
        }),
        getByCustomerId: (customerId: string) =>
            useQuery({
                queryKey: ["subscription-by-customer-id"],
                queryFn: async () => {
                    const token = await getToken();
                    const response = await tatameClient.get(
                        `/stripe/subscriptions/customer/${customerId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    );
                    return response.data.data ?? null;
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
                const token = await getToken();
                const response = await tatameClient.post<CreatePaymentIntentResponse>(
                    "/stripe/payment-intents",
                    { customerId, amount, currency },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                return response.data.data;
            },
        }),
    };

    const setupIntents = {
        create: useMutation({
            mutationFn: async ({ customerId }: { customerId: string }) => {
                const token = await getToken();
                const response = await tatameClient.post<CreateSetupIntentResponse>(
                    "/stripe/setup-intents",
                    { customerId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                return response.data.data;
            },
        }),
    };

    const ephemeralKeys = {
        create: useMutation({
            mutationFn: async ({ customerId }: { customerId: string }) => {
                const token = await getToken();
                const response = await tatameClient.post<CreateEphemeralKeyResponse>(
                    "/stripe/ephemeral-keys",
                    { customerId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                return response.data.data;
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
        // fetchProducts,
        // createCustomer,
        // createSubscription,
        // createPaymentIntent,
        // createSetupIntent,
        // createEphemeralKey,
        // fetchSubscriptionByCustomerId,
    };
}
