import { apiDownload, apiRequest, apiUpload } from "@/lib/api-client";

export type Product = {
  id: number;
  name: string;
  product_code: string;
  product_category_id: number;
  product_unit_id: number;
  category: string;
  unit: string;
  default_selling_price: string;
  purchase_price?: string;
  stock_quantity: string;
  net_loss_percentage?: string;
  description?: string | null;
  item_type?: string | null;
  tax_category?: string | null;
  active: boolean;
};

export type ProductCategory = { id: number; name: string; slug: string };
export type ProductUnit = { id: number; name: string; abbreviation: string };

export type ImportSummary = {
  created: number;
  updated: number;
  errors: { line: number; message: string }[];
};

export function fetchProducts(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest<Product[]>(`/api/v1/products${query}`);
}

export function fetchProduct(id: number) {
  return apiRequest<Product>(`/api/v1/products/${id}`);
}

export function fetchProductCategories() {
  return apiRequest<ProductCategory[]>("/api/v1/product_categories");
}

export function fetchProductUnits() {
  return apiRequest<ProductUnit[]>("/api/v1/product_units");
}

export function createProduct(product: Record<string, unknown>) {
  return apiRequest<Product>("/api/v1/products", {
    method: "POST",
    body: JSON.stringify({ product }),
  });
}

export function updateProduct(id: number, product: Record<string, unknown>) {
  return apiRequest<Product>(`/api/v1/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ product }),
  });
}

export function downloadProductImportTemplate() {
  return apiDownload("/api/v1/products/import_template", "products_import_template.csv");
}

export function importProducts(file: File, updateExisting = true) {
  const form = new FormData();
  form.append("file", file);
  form.append("update_existing", String(updateExisting));
  return apiUpload<ImportSummary>("/api/v1/products/import", form);
}

export type ProductPriceOverride = {
  id: number;
  product_id: number;
  customer_id?: number | null;
  customer_group_id?: number | null;
  customer_name?: string | null;
  customer_group_name?: string | null;
  price: string;
};

export function fetchProductPrices(productId: number) {
  return apiRequest<ProductPriceOverride[]>(
    `/api/v1/product_prices?product_id=${productId}`,
  );
}

export function createProductPrice(payload: {
  product_id: number;
  customer_id?: number;
  customer_group_id?: number;
  price: number;
}) {
  return apiRequest<ProductPriceOverride>("/api/v1/product_prices", {
    method: "POST",
    body: JSON.stringify({ product_price: payload }),
  });
}

export function updateProductPrice(id: number, price: number) {
  return apiRequest<ProductPriceOverride>(`/api/v1/product_prices/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ product_price: { price } }),
  });
}

export function deleteProductPrice(id: number) {
  return apiRequest<{ id: number }>(`/api/v1/product_prices/${id}`, {
    method: "DELETE",
  });
}

export function resolveProductPrice(productId: number, customerId: number) {
  return apiRequest<{ price: string; source: string }>(
    `/api/v1/products/${productId}/resolve_price?customer_id=${customerId}`
  );
}
