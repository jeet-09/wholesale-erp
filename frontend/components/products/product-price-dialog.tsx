"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { fetchCustomers } from "@/services/customers";
import { fetchCustomerGroups } from "@/services/customer-groups";
import {
  createProductPrice,
  deleteProductPrice,
  fetchProductPrices,
  updateProductPrice,
  type ProductPriceOverride,
} from "@/services/products";
import { ApiClientError } from "@/lib/api-client";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productName: string;
};

const emptyForm = {
  target_type: "group" as "customer" | "group",
  customer_id: "",
  customer_group_id: "",
  price: "",
};

export function ProductPriceDialog({ open, onOpenChange, productId, productName }: Props) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ProductPriceOverride | null>(null);

  const { data: customers } = useQuery({
    queryKey: ["customers", { active: "true" }],
    queryFn: () => fetchCustomers({ active: "true" }),
    enabled: open,
  });
  const { data: overrides } = useQuery({
    queryKey: ["product_prices", productId],
    queryFn: () => fetchProductPrices(productId),
    enabled: open,
  });
  const { data: groups } = useQuery({
    queryKey: ["customer_groups"],
    queryFn: fetchCustomerGroups,
    enabled: open,
  });

  const form = useForm({ defaultValues: emptyForm });

  useEffect(() => {
    if (!open) {
      setEditing(null);
      form.reset(emptyForm);
    }
  }, [open, form]);

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["product_prices", productId] });
  };

  const saveMutation = useMutation({
    mutationFn: (values: typeof emptyForm) => {
      const price = Number(values.price);
      if (editing) {
        return updateProductPrice(editing.id, price);
      }
      if (values.target_type === "customer") {
        return createProductPrice({
          product_id: productId,
          customer_id: Number(values.customer_id),
          price,
        });
      }
      return createProductPrice({
        product_id: productId,
        customer_group_id: Number(values.customer_group_id),
        price,
      });
    },
    onSuccess: async () => {
      await invalidate();
      setEditing(null);
      form.reset(emptyForm);
    },
    onError: (err) => {
      alert(err instanceof ApiClientError ? err.message : "Failed to save");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductPrice,
    onSuccess: async () => {
      await invalidate();
      if (editing) setEditing(null);
      form.reset(emptyForm);
    },
    onError: (err) => {
      alert(err instanceof ApiClientError ? err.message : "Failed to remove");
    },
  });

  const targetType = form.watch("target_type");
  const isEdit = Boolean(editing);

  const startEdit = (row: ProductPriceOverride) => {
    setEditing(row);
    form.reset({
      target_type: row.customer_group_id ? "group" : "customer",
      customer_id: row.customer_id ? String(row.customer_id) : "",
      customer_group_id: row.customer_group_id ? String(row.customer_group_id) : "",
      price: row.price,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    form.reset(emptyForm);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Special pricing"
      description={`${productName} — remove an override to use the default catalogue price (or group price for branches).`}
      className="sm:max-w-lg"
    >
      {overrides && overrides.length > 0 ? (
        <div className="mb-4 rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Current overrides
          </p>
          <ul className="max-h-40 space-y-2 overflow-y-auto text-sm text-slate-800">
            {overrides.map((row) => (
              <li
                key={row.id}
                className={`flex flex-wrap items-center justify-between gap-2 rounded-md border px-2 py-1.5 ${
                  editing?.id === row.id
                    ? "border-emerald-300 bg-white"
                    : "border-transparent"
                }`}
              >
                <span>
                  {row.customer_group_id
                    ? `Group: ${row.customer_group_name ?? "—"}`
                    : row.customer_name ?? "Customer"}
                </span>
                <div className="flex items-center gap-1">
                  <span className="tabular-nums font-medium">₹{row.price}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(row)}
                  >
                    Change
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-red-700"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                      const label = row.customer_group_name ?? row.customer_name ?? "this";
                      if (confirm(`Remove special price for ${label}?`)) {
                        deleteMutation.mutate(row.id);
                      }
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form
        className="space-y-4 border-t border-slate-200 pt-4"
        onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))}
      >
        <p className="text-sm font-medium text-slate-800">
          {isEdit ? "Update price" : "Add override"}
        </p>
        <div className="space-y-2">
          <Label>Apply to</Label>
          <Select
            {...form.register("target_type")}
            disabled={isEdit}
            className={isEdit ? "opacity-70" : undefined}
          >
            <option value="group">Customer group (all branches)</option>
            <option value="customer">Single customer / branch</option>
          </Select>
          {!isEdit ? (
            <p className="text-xs text-slate-600">
              Group price applies to every branch unless a branch has its own price.
            </p>
          ) : (
            <p className="text-xs text-slate-600">
              Customer or group cannot be changed — remove and add again to reassign.
            </p>
          )}
        </div>
        {targetType === "group" ? (
          <div className="space-y-2">
            <Label>Customer group</Label>
            <Select {...form.register("customer_group_id")} disabled={isEdit}>
              <option value="">Select group…</option>
              {groups?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.code})
                </option>
              ))}
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Customer</Label>
            <Select {...form.register("customer_id")} disabled={isEdit}>
              <option value="">Select customer…</option>
              {customers?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.account_name} ({c.abbreviation})
                </option>
              ))}
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <Label>Price (₹)</Label>
          <Input type="number" step="0.01" {...form.register("price")} />
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {isEdit ? (
            <Button type="button" variant="outline" onClick={cancelEdit}>
              Cancel edit
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending
              ? "Saving…"
              : isEdit
                ? "Update price"
                : "Add price"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
