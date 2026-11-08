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
