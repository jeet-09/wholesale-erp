# API documentation

Base URL: `/api/v1`

All JSON responses use a consistent envelope unless noted.

## Response envelope

**Success**

```json
{
  "success": true,
  "data": { }
}
```

**Error**

```json
{
  "success": false,
  "errors": [
    { "code": "invalid_credentials", "message": "Email or password is incorrect." }
  ]
}
```

HTTP status mirrors outcome: `401` unauthorized, `422` validation, `404` not found.

## Authentication

Cookie session (`_wholesale_session`). Frontend must send requests with credentials.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/login` | Body: `{ "email", "password" }` |
| POST | `/api/v1/auth/logout` | Clears session |
| GET | `/api/v1/auth/me` | Current user |

## Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | API liveness |

## Phase 1 — Customers & products

| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/api/v1/customers` | List, create |
| GET/PATCH | `/api/v1/customers/:id` | Show, update |
| POST | `/api/v1/customers/:id/archive` | Soft archive (inactive) |
| POST | `/api/v1/customers/:id/restore` | Reactivate archived customer |
| GET/POST/PATCH | `/api/v1/customer_groups` | Groups + show includes branches |
| GET/POST/PATCH | `/api/v1/products` | Catalog |
| GET | `/api/v1/products/import_template` | CSV template download |
| POST | `/api/v1/products/import` | multipart `file` or `csv` body |
| GET | `/api/v1/products/:id/resolve_price?customer_id=` | Price resolution |
| GET/POST/PATCH/DELETE | `/api/v1/product_prices` | Custom pricing (create / update price / remove override) |

## Upcoming (Phase 2+)
- `/api/v1/orders`, `/api/v1/orders/daily_matrix`
- `/api/v1/invoices`, `/api/v1/challans`, `/api/v1/payments`
- `/api/v1/ledger`, `/api/v1/reports/*`

OpenAPI spec will live at `/api-docs` once rswag specs are added.
