import { z } from "zod";

export const customerSchema = z.object({
  customer_type: z.enum(["individual", "branch"]),
  customer_group_id: z.number().optional().nullable(),
  // Kitchen name — may be blank in UI; filled from Name on save if empty
  restaurant_name: z.string(),
  account_name: z.string().min(1, "Name is required"),
  customer_code: z.string().min(1, "Code is required"),
  abbreviation: z.string().min(1, "Abbreviation is required"),
  contact_person: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  billing_address: z.string().optional(),
  delivery_address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  gstin: z.string().optional(),
  opening_balance: z.number().min(0),
  balance_type: z.enum(["debit", "credit"]),
  payment_terms: z.string().optional(),
  notes: z.string().optional(),
  active: z.boolean().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
