import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import tatameClient from "../lib/tatame-api";

interface fetchProductsResponse {
    data: {
        default_price: {
            unit_amount: number;
            currency: string;
        };
        description: string;
        id: string;
        metadata: Record<string, unknown>;
        name: string;
    }[];
    count: number;
}

export function useStripeHook() {
    const { getToken } = useAuth();

    const fetchProducts = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const token = await getToken();
            const response = await tatameClient.get<fetchProductsResponse>(
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

    return { fetchProducts };
}
