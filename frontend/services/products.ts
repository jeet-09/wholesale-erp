import { apiRequest } from "@/lib/api-client";

export type Product = {
  id: number;
  name: string;
  product_code: string;
  category: string;
  unit: string;
  default_selling_price: string;
  stock_quantity: string;
  active: boolean;
};

export function fetchProducts(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest<Product[]>(`/api/v1/products${query}`);
}
