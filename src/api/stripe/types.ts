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

export interface DeleteSubscriptionResponse {
  data: { id: string };
  deleted: boolean;
}

export interface FetchSubscriptionResponse {
  data: {
    id: string;
    currency: string;
    current_period_end: number;
    current_period_start: number;
    plan: {
      id: string;
      active: boolean;
      amount: number;
      currency: string;
      interval: string;
      interval_count: number;
      product: string;
    };
    trial_end: number;
    trial_start: number;
  };
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
