# TheZoova — Wholesale ERP

Wholesale operations app for customers, products, pricing, and (upcoming) daily orders, billing, challans, and payments.

Rails owns all business logic and data. The Next.js UI talks to the API only.

## Stack

| Layer | Technology |
|-------|------------|
| Backend | Ruby on Rails 8.1 (API-only), PostgreSQL, Redis, Sidekiq |
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Infra | Docker Compose (optional) |

## Repository layout

```
├── backend/                 # Rails API
│   ├── db/seeds.rb          # Core seed (admin, categories, units)
│   └── db/seeds/demo_data.rb # Demo customers, products, prices
├── frontend/                # Next.js app
├── scripts/dev-services.sh  # Start Homebrew Postgres + Redis
├── docker-compose.yml       # Optional all-in-one containers
└── *.md                     # Architecture and design docs
```

## URLs (local)

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000 |

---

## Prerequisites (install once)

Required for the **recommended path** (no Docker):

| Tool | Version | Notes |
|------|---------|--------|
| Ruby | **3.4.3** | Rails 8.1 — use rbenv/rvm/asdf |
| Bundler | latest | `gem install bundler` |
| Node.js | **20+** | includes npm |
| PostgreSQL | **16+** | Homebrew: `brew install postgresql@16` |
| Redis | **7+** | Homebrew: `brew install redis` |

Optional: **Docker Desktop** if you prefer containers instead of local Postgres/Redis/Ruby/Node.

---

## Recommended setup (without Docker)

This is the path used for day-to-day development on macOS.

### 1. Start Postgres and Redis

```bash
./scripts/dev-services.sh
# or:
# brew services start postgresql@16
# brew services start redis
```

Check:

```bash
# Postgres
pg_isready -h localhost

# Redis
redis-cli ping   # should print PONG
```

### 2. Backend (Rails + database)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

- Set `DATABASE_USER` to your **macOS username** (Homebrew Postgres).
- Leave `DATABASE_PASSWORD` empty for typical local Homebrew installs.
- Keep `SEED_DEMO_DATA=true` to load demo customers/products (recommended).

```bash
bundle install
bin/rails db:create db:migrate db:seed
bin/rails server -p 3000
```

Leave this terminal running. API: http://localhost:3000

### 3. Frontend (Next.js)

Open a **second** terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

`.env.local` should contain:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

App: http://localhost:3001

### 4. Log in

| Role | Email | Password |
|------|--------|----------|
| Admin | `admin@kisantraders.local` | `ChangeMe123!` |
| Staff | `staff@kisantraders.local` | `ChangeMe123!` |

Passwords come from `SEED_ADMIN_PASSWORD` / `SEED_STAFF_PASSWORD` in `backend/.env` (defaults above).

---

## Seed data

Seeds are **idempotent** (safe to re-run). They use find-or-create by stable codes/emails.

### Seed files

| File | Purpose |
|------|---------|
| `backend/db/seeds.rb` | Admin user, product categories, product units; then loads demo data |
| `backend/db/seeds/demo_data.rb` | Staff user, customer group + branches, individual customers, sample products, special prices |

### What gets created (`SEED_DEMO_DATA=true`)

- Admin + staff users  
- Product categories and units  
- Butterfly Hospitality group + 4 branches  
- Individual customers (e.g. Amar Kitchen, etc.)  
- ~20 sample products  
- Sample customer/group pricing overrides  

### Seed commands

**Full seed** (after DB exists):

```bash
cd backend
bin/rails db:seed
```

**Create DB + migrate + seed** (first time):

```bash
cd backend
bin/rails db:create db:migrate db:seed
```

**Wipe database and seed from scratch** (destroys all data):

```bash
cd backend
bin/rails db:reset
# same as: drop + create + migrate + seed
```

**Seed without demo customers/products** (admin + categories/units only):

```bash
cd backend
# either set SEED_DEMO_DATA=false in .env, or:
SEED_DEMO_DATA=false bin/rails db:seed
```

---

## Daily development (after first setup)

1. Ensure Postgres + Redis are running (`./scripts/dev-services.sh`).  
2. Terminal 1 — API:

```bash
cd backend && bin/rails server -p 3000
```

3. Terminal 2 — UI:

```bash
cd frontend && npm run dev
```

4. Open http://localhost:3001 and sign in.

---

## Setup with Docker

Use this if you do **not** want to install Ruby, Node, Postgres, or Redis on your machine. Everything runs in containers.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and **running**
- Ports **3000**, **3001**, **5432**, and **6379** free on your machine

### 1. Start all services

From the **project root** (where `docker-compose.yml` lives):

```bash
docker compose up --build
```

First run builds images (can take a few minutes). Later runs are faster.

Services started:

| Service | Role | Host URL |
|---------|------|----------|
| `postgres` | Database | localhost:5432 |
| `redis` | Cache / Sidekiq | localhost:6379 |
| `backend` | Rails API | http://localhost:3000 |
| `sidekiq` | Background jobs | — |
| `frontend` | Next.js UI | http://localhost:3001 |

Compose sets DB credentials for you (`DATABASE_USER=postgres`, `DATABASE_PASSWORD=postgres`). You do **not** need to copy `backend/.env` for Docker.

### 2. Create database, migrate, and seed

In a **second** terminal (while compose is still running):

```bash
# Create DB + run migrations (first time or after new migrations)
docker compose exec backend bin/rails db:prepare

# Load admin, categories, demo customers/products/prices
docker compose exec backend bin/rails db:seed
```

**Wipe Docker DB and re-seed from scratch:**

```bash
docker compose exec backend bin/rails db:reset
```

**Seed without demo customers/products:**

```bash
docker compose exec -e SEED_DEMO_DATA=false backend bin/rails db:seed
```

### 3. Open the app and log in

1. Open http://localhost:3001  
2. Sign in:

| Role | Email | Password |
|------|--------|----------|
| Admin | `admin@kisantraders.local` | `ChangeMe123!` |
| Staff | `staff@kisantraders.local` | `ChangeMe123!` |

### 4. Useful Docker commands

```bash
# Start in background (detached)
docker compose up --build -d

# Follow logs
docker compose logs -f

# Logs for one service
docker compose logs -f backend
docker compose logs -f frontend

# Stop containers (keeps database volume)
docker compose down

# Stop and delete database volume (full reset)
docker compose down -v

# Re-seed after containers are up
docker compose exec backend bin/rails db:seed

# Open a Rails console inside the container
docker compose exec backend bin/rails console
```

### 5. Daily use with Docker

```bash
# From project root
docker compose up
# then (if DB not seeded yet):
docker compose exec backend bin/rails db:prepare db:seed
```

Open http://localhost:3001 when the frontend is ready.

> **Note:** If you already run Homebrew Postgres/Redis on the same ports, stop them first (`brew services stop postgresql@16 redis`) or change ports in `docker-compose.yml` to avoid conflicts.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `EADDRINUSE` on port 3001 | Find PID: `lsof -i :3001` then `kill <PID>` |
| Next.js `ENOENT` / `build-manifest.json` | Stop servers, then `cd frontend && npm run dev:clean` |
| Postgres connection refused | Without Docker: `./scripts/dev-services.sh`. With Docker: `docker compose up` and wait for healthy postgres |
| Port 5432 already in use | Stop Homebrew Postgres, or stop other Docker Postgres |
| Wrong DB user | Without Docker → macOS username; Docker → `postgres` / `postgres` |
| No customers after Docker start | `docker compose exec backend bin/rails db:prepare db:seed` |
| Stuck on login after logout | Hard refresh; ensure API is on port 3000 |

More frontend notes: [frontend/TROUBLESHOOTING.md](./frontend/TROUBLESHOOTING.md)

---

## Documentation

| Doc | Contents |
|-----|----------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design and layers |
| [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) | Schema overview |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | REST API reference |
| [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) | Coding standards |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Phase status (Phase 1 done; Phase 2 next) |

---

## Implementation status

- **Phase 0** — Foundation, auth, shell — Done  
- **Phase 1** — Customers, groups, products, CSV import, special pricing — Done  
- **Phase 2** — Daily orders & matrix — Not started  

Details: [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)

## License

Proprietary — internal business use.
