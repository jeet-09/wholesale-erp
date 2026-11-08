# Database design

PostgreSQL, normalized relational schema. Money fields use `decimal` / `numeric(15,2)` (and higher precision where needed for quantities).

## Phase 0 tables

### users

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| email | string | unique, indexed |
| password_digest | string | bcrypt |
| name | string | |
| role | string | enum: admin, manager, staff, readonly |
| active | boolean | default true |
| timestamps | | |

### sessions

Rails encrypted cookie session stores `user_id`; no `sessions` table in Phase 0.

## Planned core tables (Phases 1–6)

Documented here for migration planning; implemented incrementally.

- **customers**, **customer_groups**, **customer_group_members**, **customer_addresses**
- **products**, **product_categories**, **product_units**, **product_prices**
- **orders**, **order_items**, **order_attachments**
- **invoices**, **invoice_items**
- **challans**, **challan_items**
- **payments**, **payment_allocations**
- **account_transactions**
- **stock_movements**
- **audit_logs**, **business_settings**

## Key relationships

- `CustomerGroup` has many `customers` (branches) via `customer_group_members` or `parent_group_id` (exact FK design in Phase 1).
- Each branch maintains independent orders, invoices, challans, payments, ledger balance.
- `Order` → many `OrderItem`; optional link to `Invoice`.
- `Payment` → many `PaymentAllocation` → `Invoice`.
- `AccountTransaction` references source (`invoice`, `payment`, `adjustment`).

## Indexing strategy

- Unique: customer codes, product codes, invoice numbers, challan numbers, payment numbers.
- Composite: `(order_date, customer_id)`, `(customer_id, transaction_date)` for ledger.
- Partial indexes on `active = true` for catalogue lookups.

## Sign convention (ledger)

Debit increases what the customer owes the wholesaler. Credit reduces balance. Documented consistently in `Accounting::CustomerLedgerQuery` (Phase 5).
