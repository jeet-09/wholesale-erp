import { apiRequest } from "@/lib/api-client";

export type Customer = {
  id: number;
  customer_type: string;
  customer_group_id?: number | null;
  account_name: string;
  restaurant_name: string;
  customer_code: string;
  abbreviation: string;
  customer_group_name?: string | null;
  contact_person?: string | null;
  mobile?: string | null;
  email?: string | null;
  billing_address?: string | null;
  delivery_address?: string | null;
  city?: string | null;
  state?: string | null;
  gstin?: string | null;
  opening_balance: string;
  balance_type: string;
  payment_terms?: string | null;
  notes?: string | null;
  active: boolean;
};

export type CustomerListFilters = {
  search?: string;
  customer_code?: string;
  abbreviation?: string;
  account_name?: string;
  customer_type?: string;
  customer_group_id?: string;
  city?: string;
  active?: string;
};

export type CustomerPayload = {
  customer: Record<string, unknown>;
};

function filtersToQuery(filters: CustomerListFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchCustomers(filters: CustomerListFilters = {}) {
  return apiRequest<Customer[]>(`/api/v1/customers${filtersToQuery(filters)}`);
}

export function fetchCustomer(id: number) {
  return apiRequest<Customer>(`/api/v1/customers/${id}`);
}

export function createCustomer(payload: CustomerPayload) {
  return apiRequest<Customer>("/api/v1/customers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCustomer(id: number, payload: CustomerPayload) {
  return apiRequest<Customer>(`/api/v1/customers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function archiveCustomer(id: number) {
  return apiRequest<Customer>(`/api/v1/customers/${id}/archive`, {
    method: "POST",
  });
}

export function restoreCustomer(id: number) {
  return apiRequest<Customer>(`/api/v1/customers/${id}/restore`, {
    method: "POST",
  });
}
