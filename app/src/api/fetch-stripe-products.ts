import axiosClient from "../lib/axios";

export interface StripeProduct {
  id: string;
  description: string;
  images: string[];
  name: string;
  default_price: {
    id: string;
    currency: string;
    unit_amount: number;
  };
}

export default async function fetchStripeProducts() {
  const { data } = await axiosClient.get<{ products: StripeProduct[] }>(
    "/stripe/products"
  );
  return data.products;
}
