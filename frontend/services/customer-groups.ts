import { apiRequest } from "@/lib/api-client";
import type { Customer } from "@/services/customers";

export type CustomerGroup = {
  id: number;
  name: string;
  code: string;
  abbreviation?: string | null;
  notes?: string | null;
  active: boolean;
  branches_count: number;
};

export type CustomerGroupDetail = CustomerGroup & {
  branches: Customer[];
};

export function fetchCustomerGroups() {
  return apiRequest<CustomerGroup[]>("/api/v1/customer_groups");
}

export function fetchCustomerGroup(id: number) {
  return apiRequest<CustomerGroupDetail>(`/api/v1/customer_groups/${id}`);
}

export function createCustomerGroup(group: Record<string, unknown>) {
  return apiRequest<CustomerGroup>("/api/v1/customer_groups", {
    method: "POST",
    body: JSON.stringify({ customer_group: group }),
  });
}

export function updateCustomerGroup(id: number, group: Record<string, unknown>) {
  return apiRequest<CustomerGroup>(`/api/v1/customer_groups/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ customer_group: group }),
  });
}
