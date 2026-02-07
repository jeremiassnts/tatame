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

    const fetchProducts = useQuery({
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
    });

    const createCustomer = useMutation({
        mutationFn: async ({ name, email }: { name: string; email: string }) => {
            const token = await getToken();
            const response = await tatameClient.post<CreateCustomerResponse>(
                "/stripe/customers",
                {
                    name,
                    email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data.data;
        },
    });

    const createSubscription = useMutation({
        mutationFn: async ({
            customerId,
            priceId,
        }: {
            customerId: string;
            priceId: string;
        }) => {
            const token = await getToken();
            const response = await tatameClient.post<CreateSubscriptionResponse>(
                "/stripe/subscriptions",
                { customerId, priceId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data.data;
        },
    });

    const createPaymentIntent = useMutation({
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
    });

    const createSetupIntent = useMutation({
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
    });

    const createEphemeralKey = useMutation({
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
    });

    return {
        fetchProducts,
        createCustomer,
        createSubscription,
        createPaymentIntent,
        createSetupIntent,
        createEphemeralKey,
    };
}
