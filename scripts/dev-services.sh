#!/usr/bin/env bash
# Start local PostgreSQL and Redis (Homebrew) for Rails development.
set -euo pipefail

if ! command -v brew >/dev/null; then
  echo "Homebrew required, or run: docker compose up -d postgres redis"
  exit 1
fi

brew services start postgresql@16
brew services start redis

echo "PostgreSQL: $(/opt/homebrew/opt/postgresql@16/bin/pg_isready -h localhost 2>&1 || true)"
echo "Redis: check with redis-cli ping"
