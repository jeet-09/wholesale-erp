# EzzyBilling → TheZoova field mapping

UI labels follow the legacy **EzzyBilling** screens (Gagangiri Vegetables).  
API / database columns stay snake_case for Rails.

## Accounts (Customers)

| EzzyBilling label | Our API / DB field | Notes |
|-------------------|--------------------|--------|
| Name | `account_name` | Required |
| Main Group | `customer_group` / `customer_group_id` | Franchise group (e.g. BF) |
| Description | `notes` | Free text |
| Mob No | `mobile` | |
| Abbreviation | `abbreviation` | Matrix column code (BF, AMK, …) |
| Opening Balance | `opening_balance` | |
| Credit / Debit | `balance_type` | `credit` / `debit` (shown as Cr. / Dr.) |
| Account Name (list) | `account_name` | |
| Group Name (list) | `customer_group_name` | |
| Op Balance (list) | `opening_balance` | |
| Balance Type (list) | `balance_type` | Dr. / Cr. |
| Kitchen / restaurant | `restaurant_name` | Extra field we keep for ops |
| Code | `customer_code` | Unique account code |

## Items (Products)

| EzzyBilling label | Our API / DB field | Notes |
|-------------------|--------------------|--------|
| Item's Name | `name` | Required |
| Item Type | `product_category` / category | Indian, Exotic, Fruits, Imported, Others |
| Item Unit | `product_unit` / unit | Kg, Piece, Box, Packet, … |
| Stock | `stock_quantity` | Stock balance |
| Net Loss | `net_loss_percentage` | |
| Tax Deduct | `tax_category` | |
| Item Name (list) | `name` | |
| Item Type (list) | `category` | |
| Item Unit (list) | `unit` | |
| Stock Balance (list) | `stock_quantity` | |
| Selling / Price | `default_selling_price` | Invoice price |
| Purchase price | `purchase_price` | Cost |
| Product code | `product_code` | Unique SKU |

## Modules (nav ↔ EzzyBilling)

| EzzyBilling | Our nav |
|-------------|---------|
| Account (F1) | Accounts |
| Items (F2) | Items |
| Sales Invoice (F5) | Sales Invoices (Phase 3) |
| Quick Payment (F6) | Payments (Phase 5) |
| Ledger Book (F8) | Customer Ledgers (Phase 5) |
| Hotel Challan (F9) | Delivery Challans (Phase 4) |
| Day Book / Reports | Reports (Phase 6) |
| Order Book (matrix) | Daily Orders (Phase 2) |
