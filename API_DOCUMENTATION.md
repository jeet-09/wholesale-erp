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

## Upcoming (Phase 1+)

- `/api/v1/customers`, `/api/v1/customer_groups`
- `/api/v1/products`, `/api/v1/products/import`
- `/api/v1/orders`, `/api/v1/orders/daily_matrix`
- `/api/v1/invoices`, `/api/v1/challans`, `/api/v1/payments`
- `/api/v1/ledger`, `/api/v1/reports/*`

OpenAPI spec will live at `/api-docs` once rswag specs are added.
