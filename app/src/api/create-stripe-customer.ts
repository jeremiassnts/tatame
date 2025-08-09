import axiosClient from "../lib/axios";

interface CreateCustomerProps {
  email: string | undefined;
  name: string | undefined;
  address:
    | {
        city: string | undefined;
        state: string | undefined;
        postal_code: string | undefined;
        country: string | undefined;
        line1: string | undefined;
      }
    | undefined;
}

export async function createCustomer({
  email,
  name,
  address,
}: CreateCustomerProps) {
  if (!email || !name || !address) {
    throw new Error("Email is required");
  }
  const response = await axiosClient.post<{ customerId: string }>(
    "/stripe/customer",
    { email, name, address }
  );
  return response.data;
}
