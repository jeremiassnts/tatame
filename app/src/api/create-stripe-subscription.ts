import axiosClient from "../lib/axios";

interface CreateSubscriptionProps {
  customerId: string | undefined;
  priceId: string | undefined;
}

export async function createSubscription({
  customerId,
  priceId,
}: CreateSubscriptionProps) {
  if (!customerId || !priceId) {
    throw new Error("All fields are required");
  }
  const response = await axiosClient.post<{
    subscriptionId: string;
    secret: string;
  }>("/stripe/subscribe", { customerId, priceId });
  return response.data;
}
