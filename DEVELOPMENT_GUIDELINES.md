# Development guidelines

## Rails

1. Thin controllers; business logic in `app/services`.
2. Complex reads in `app/queries`.
3. Use `ApplicationService::Result` for service outcomes.
4. Serializers under `app/serializers/api/v1`.
5. Financial calculations in Ruby with `BigDecimal`; never float for money.
6. Wrap multi-step writes in transactions.
7. RSpec for models, services, requests on critical paths.
8. RuboCop Rails Omakase — run `bin/rubocop` before commit.

## Next.js

1. No direct database access.
2. API calls only through `lib/api-client.ts` and `services/*`.
3. Strict TypeScript.
4. Small components; shared tables in `components/tables`.
5. Use TanStack Query for fetching and mutations.

## Git

- Monorepo: `backend/`, `frontend/`
- Conventional commits encouraged: `feat:`, `fix:`, `chore:`

## Environment

- Backend: `backend/.env` (see `.env.example`)
- Frontend: `frontend/.env.local` — `NEXT_PUBLIC_API_URL`

## Testing locally

```bash
# Backend
cd backend && bundle exec rspec

# Frontend
cd frontend && npm run lint && npm run build
```

## Security

- Strong parameters everywhere.
- Rate limit login (Rack::Attack in Phase 7).
- Validate uploads (type, size) for order attachments.
- No secrets in repository.
