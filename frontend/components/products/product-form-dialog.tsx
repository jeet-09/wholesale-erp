"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productSchema, type ProductFormValues } from "@/schemas/product";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  createProduct,
  updateProduct,
  fetchProductCategories,
  fetchProductUnits,
} from "@/services/products";
import { ApiClientError } from "@/lib/api-client";

type ProductEdit = {
  id: number;
  product_code: string;
  name: string;
  product_category_id: number;
  product_unit_id: number;
  default_selling_price: string;
  purchase_price?: string;
  stock_quantity: string;
  net_loss_percentage?: string;
  item_type?: string | null;
  tax_category?: string | null;
  description?: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductEdit | null;
};

const defaults: ProductFormValues = {
  product_category_id: 0,
  product_unit_id: 0,
  name: "",
  product_code: "",
  default_selling_price: 0,
  purchase_price: 0,
  stock_quantity: 0,
  net_loss_percentage: 0,
  tax_category: "",
  description: "",
};

export function ProductFormDialog({ open, onOpenChange, product }: Props) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(product);

  const { data: categories } = useQuery({
    queryKey: ["product_categories"],
    queryFn: fetchProductCategories,
    enabled: open,
  });
  const { data: units } = useQuery({
    queryKey: ["product_units"],
    queryFn: fetchProductUnits,
    enabled: open,
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaults,
    values: product
      ? {
          product_category_id: product.product_category_id,
          product_unit_id: product.product_unit_id,
          name: product.name,
          product_code: product.product_code,
          default_selling_price: Number(product.default_selling_price),
          purchase_price: Number(product.purchase_price ?? 0),
          stock_quantity: Number(product.stock_quantity),
          net_loss_percentage: Number(product.net_loss_percentage ?? 0),
          item_type: product.item_type ?? "",
          tax_category: product.tax_category ?? "",
          description: product.description ?? "",
        }
      : defaults,
  });

  const mutation = useMutation({
    mutationFn: (values: ProductFormValues) => {
      const payload = { product: values };
      if (isEdit && product) {
        return updateProduct(product.id, payload.product);
      }
      return createProduct(payload.product);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
      form.reset(defaults);
    },
    onError: (err) => {
      const msg = err instanceof ApiClientError ? err.message : "Save failed";
      form.setError("root", { message: msg });
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Update Item" : "New Item"}
      description="Same fields as EzzyBilling Items — Item's Name, Item Type, Item Unit, Stock, Net Loss."
      className="sm:max-w-2xl"
    >
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Item&apos;s Name *</Label>
            <Input {...form.register("name")} placeholder="e.g. Tomato Big" />
            {form.formState.errors.name ? (
              <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label>Item Type *</Label>
            <Select
              {...form.register("product_category_id", {
                setValueAs: (v) => Number(v),
              })}
            >
              <option value={0}>Select…</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Item Unit *</Label>
            <Select
              {...form.register("product_unit_id", {
                setValueAs: (v) => Number(v),
              })}
            >
              <option value={0}>Select…</option>
              {units?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.abbreviation})
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Item code</Label>
            <Input
              {...form.register("product_code")}
              disabled={isEdit}
              className="font-mono uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label>Stock</Label>
            <Input
              type="number"
              step="0.001"
              {...form.register("stock_quantity", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>Net Loss (%)</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register("net_loss_percentage", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>Tax Deduct</Label>
            <Input {...form.register("tax_category")} placeholder="Tax category" />
          </div>
          <div className="space-y-2">
            <Label>Price (selling)</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register("default_selling_price", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>Purchase price</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register("purchase_price", { valueAsNumber: true })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea rows={2} {...form.register("description")} />
        </div>
        {form.formState.errors.root ? (
          <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>
        ) : null}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Clear / Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? "Saving…"
              : isEdit
                ? "Update Record"
                : "Add Record"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
