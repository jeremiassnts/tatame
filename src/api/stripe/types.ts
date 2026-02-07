export interface FetchProductsResponse {
  data: {
    default_price: {
      id: string;
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

export interface CreateCustomerResponse {
  data: { id: string };
  created: boolean;
}

export interface CreateSubscriptionResponse {
  data: { id: string };
  created: boolean;
}

export interface CreatePaymentIntentResponse {
  data: { client_secret: string };
}

export interface CreateSetupIntentResponse {
  data: { client_secret: string };
}

export interface CreateEphemeralKeyResponse {
  data: { secret: string };
}
