"use client";

import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerSchema, type CustomerFormValues } from "@/schemas/customer";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  createCustomer,
  updateCustomer,
  type Customer,
} from "@/services/customers";
import { fetchCustomerGroups } from "@/services/customer-groups";
import { ApiClientError } from "@/lib/api-client";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
  defaultType?: "individual" | "branch";
  defaultGroupId?: number;
};

const defaultValues: CustomerFormValues = {
  customer_type: "individual",
  restaurant_name: "",
  account_name: "",
  customer_code: "",
  abbreviation: "",
  opening_balance: 0,
  balance_type: "debit",
  customer_group_id: null,
};

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
  defaultType,
  defaultGroupId,
}: Props) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(customer);
  const { data: groups } = useQuery({
    queryKey: ["customer_groups"],
    queryFn: fetchCustomerGroups,
    enabled: open,
  });

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues,
    values: customer
      ? {
          customer_type: customer.customer_type as "individual" | "branch",
          customer_group_id: customer.customer_group_id ?? null,
          restaurant_name: customer.restaurant_name,
          account_name: customer.account_name,
          customer_code: customer.customer_code,
          abbreviation: customer.abbreviation,
          contact_person: customer.contact_person ?? "",
          mobile: customer.mobile ?? "",
          email: customer.email ?? "",
          billing_address: customer.billing_address ?? "",
          delivery_address: customer.delivery_address ?? "",
          city: customer.city ?? "",
          state: customer.state ?? "",
          gstin: customer.gstin ?? "",
          opening_balance: Number(customer.opening_balance) || 0,
          balance_type: customer.balance_type as "debit" | "credit",
          payment_terms: customer.payment_terms ?? "",
          notes: customer.notes ?? "",
          active: customer.active,
        }
      : {
          ...defaultValues,
          customer_type: defaultType ?? "individual",
          customer_group_id: defaultGroupId ?? null,
        },
  });

  const customerType = form.watch("customer_type");
  const balanceType = form.watch("balance_type");

  const mutation = useMutation({
    mutationFn: (values: CustomerFormValues) => {
      // Keep kitchen name in sync with account name when left blank.
      const restaurant =
        values.restaurant_name?.trim() || values.account_name;
      const payload = {
        customer: {
          ...values,
          restaurant_name: restaurant,
          email: values.email || undefined,
          customer_group_id:
            values.customer_type === "branch" ? values.customer_group_id : null,
        },
      };
      if (isEdit && customer) {
        return updateCustomer(customer.id, payload);
      }
      return createCustomer(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      await queryClient.invalidateQueries({ queryKey: ["customer_groups"] });
      onOpenChange(false);
      form.reset(defaultValues);
    },
    onError: (err) => {
      const msg =
        err instanceof ApiClientError ? err.message : "Save failed";
      form.setError("root", { message: msg });
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Update Account" : "New Account"}
      description="Same fields as EzzyBilling Accounts — Name, Main Group, Abbreviation, Opening Balance."
      className="sm:max-w-2xl"
    >
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name *" error={form.formState.errors.account_name?.message}>
            <Input {...form.register("account_name")} placeholder="Account name" />
          </Field>
          <Field label="Main Group">
            <Select
              {...form.register("customer_group_id", {
                setValueAs: (v) => (v === "" ? null : Number(v)),
              })}
            >
              <option value="">— None —</option>
              {groups?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.abbreviation || g.code} — {g.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Abbreviation *" error={form.formState.errors.abbreviation?.message}>
            <Input
              {...form.register("abbreviation")}
              className="font-mono uppercase"
              placeholder="e.g. BF, AMK"
            />
          </Field>
          <Field label="Code *" error={form.formState.errors.customer_code?.message}>
            <Input
              {...form.register("customer_code")}
              disabled={isEdit}
              className="font-mono uppercase"
            />
          </Field>
          <Field label="Mob No">
            <Input {...form.register("mobile")} placeholder="Mobile number" />
          </Field>
          <div className="space-y-2">
            <Label>Account type</Label>
            <Select {...form.register("customer_type")} disabled={isEdit}>
              <option value="individual">Individual (single account)</option>
              <option value="branch">Branch (under Main Group)</option>
            </Select>
          </div>
          {customerType === "branch" && !form.watch("customer_group_id") ? (
            <p className="text-xs text-amber-700 sm:col-span-2">
              Branch accounts should select a Main Group (required).
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Opening Balance">
            <Input
              type="number"
              step="0.01"
              {...form.register("opening_balance", { valueAsNumber: true })}
            />
          </Field>
          <div className="space-y-2">
            <Label>Balance type</Label>
            <div className="flex h-10 items-center gap-4 rounded-md border border-slate-300 px-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="debit"
                  checked={balanceType === "debit"}
                  onChange={() => form.setValue("balance_type", "debit")}
                />
                Debit (Dr.)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="credit"
                  checked={balanceType === "credit"}
                  onChange={() => form.setValue("balance_type", "credit")}
                />
                Credit (Cr.)
              </label>
            </div>
          </div>
        </div>

        <Field label="Kitchen / restaurant name">
          <Input
            {...form.register("restaurant_name")}
            placeholder="Defaults to Name if left blank"
          />
        </Field>

        <Field label="Description">
          <Textarea rows={2} {...form.register("notes")} />
        </Field>

        <Field label="Billing address">
          <Textarea rows={2} {...form.register("billing_address")} />
        </Field>

        {form.formState.errors.root ? (
          <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>
        ) : null}

        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
