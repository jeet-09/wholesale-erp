import { z } from "zod";

export const productSchema = z.object({
  product_category_id: z.number().min(1, "Category is required"),
  product_unit_id: z.number().min(1, "Unit is required"),
  name: z.string().min(1, "Name is required"),
  product_code: z.string().min(1, "Product code is required"),
  item_type: z.string().optional(),
  default_selling_price: z.number().min(0),
  purchase_price: z.number().min(0),
  stock_quantity: z.number().min(0),
  net_loss_percentage: z.number().min(0).max(100).optional(),
  tax_category: z.string().optional(),
  description: z.string().optional(),
  active: z.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
