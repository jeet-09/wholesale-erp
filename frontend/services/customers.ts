import { apiRequest } from "@/lib/api-client";

export type Customer = {
  id: number;
  customer_type: string;
  account_name: string;
  restaurant_name: string;
  customer_code: string;
  abbreviation: string;
  customer_group_name?: string | null;
  mobile?: string | null;
  city?: string | null;
  active: boolean;
};

export function fetchCustomers(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest<Customer[]>(`/api/v1/customers${query}`);
}
