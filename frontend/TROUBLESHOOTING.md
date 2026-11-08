# Frontend troubleshooting

## `ENOENT` … `build-manifest.json` or `_buildManifest.js.tmp`

This is almost always a **stale or corrupted `.next` cache**, or **two dev servers** writing the same folder at once.

### Fix (do in order)

1. Stop **all** `npm run dev` processes (every terminal tab).
2. Clean and restart:

```bash
cd frontend
npm run dev:clean
```

3. Hard refresh the browser (Cmd+Shift+R).

### Avoid

- Do not run `npm run build` while `npm run dev` is running.
- Do not start two `next dev` instances on port 3001.
- If errors return often, use `npm run dev` (Webpack) instead of `npm run dev:turbo`.

### Still broken?

```bash
rm -rf .next node_modules/.cache
npm run dev:clean
```

## Unstyled page (raw HTML, purple links, no sidebar layout)

Logs show **`GET /_next/static/chunks/main-app.js 404`** and **`app/layout.css 404`**.

Cause: **`npm run dev` and `npm run build` mixed** — the dev server expects dev chunks, but `.next` only has production hashed files (or the opposite).

### Fix

```bash
# Stop every Node on port 3001 (Ctrl+C in the terminal running npm run dev)
lsof -ti :3001 | xargs kill

cd frontend
rm -rf .next
npm run dev
```

Then hard refresh (Cmd+Shift+R).

### Do not mix

| Command | Use when |
|---------|----------|
| `npm run dev` | Daily development (port 3001) |
| `npm run build` then `npm start` | Production preview — uses different assets |

Never run `npm run build` while `npm run dev` is already running.
