import { z } from "zod";

export const productSchema = z.object({
  product_category_id: z.number().min(1, "Item Type is required"),
  product_unit_id: z.number().min(1, "Item Unit is required"),
  name: z.string().min(1, "Item's Name is required"),
  product_code: z.string().min(1, "Item code is required"),
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
