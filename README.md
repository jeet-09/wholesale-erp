# Vegetable Wholesale Management ERP

Production-oriented wholesale ERP for order processing, billing, delivery challans, payments, and customer accounting. Replaces a legacy Windows desktop billing application.

## Stack

| Layer | Technology |
|-------|------------|
| Backend | Ruby on Rails (API-only), PostgreSQL, Redis, Sidekiq |
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Infra | Docker Compose |

Rails is the single source of truth for business logic and persistence. The frontend communicates only via REST APIs.

## Repository layout

```
├── backend/          # Rails API
├── frontend/         # Next.js application
├── docker-compose.yml
└── docs/             # Architecture and design notes (root-level *.md)
```

## Quick start (local)

### Prerequisites

- Ruby **3.4.3** (Rails 8.1), Bundler
- Node.js 20+
- PostgreSQL 16+ and Redis 7+ (Homebrew or Docker)
- Docker (optional)

**Local databases (Homebrew):**

```bash
./scripts/dev-services.sh   # postgres@16 + redis
```

Copy `backend/.env.example` to `backend/.env`. For Homebrew Postgres use your **macOS username** as `DATABASE_USER` and leave `DATABASE_PASSWORD` empty. For Docker use `postgres` / `postgres`.

### With Docker Compose

```bash
docker compose up --build
```

- API: http://localhost:3000
- Frontend: http://localhost:3001
- Default admin (development seeds): see `backend/db/seeds.rb`

### Without Docker

**Backend**

```bash
cd backend
cp .env.example .env
bundle install
rails db:create db:migrate db:seed
bin/rails server -p 3000
```

**Frontend**

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL=http://localhost:3000` in `frontend/.env.local`.

**Random `ENOENT` / `build-manifest.json` errors?** Stop all dev servers, then `cd frontend && npm run dev:clean`. See [frontend/TROUBLESHOOTING.md](./frontend/TROUBLESHOOTING.md).

### Demo / test data

```bash
cd backend && bundle exec rails db:seed
```

Creates an admin user, product categories, **7 customers** (3 individuals + 4 franchise branches), **20 sample products**, and sample customer/group pricing. Set `SEED_DEMO_DATA=false` in `.env` to skip demo rows.

| Login | Email | Password (default) |
|-------|--------|-------------------|
| Admin | `admin@kisantraders.local` | `ChangeMe123!` |
| Staff | `staff@kisantraders.local` | `ChangeMe123!` |

View lists in the app: **Customers** and **Products** after login on http://localhost:3001.

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — system design and patterns
- [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) — schema overview
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) — REST API reference
- [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) — coding standards
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) — phased delivery status

## Implementation phases

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for current phase and checklist.

## License

Proprietary — internal business use.
