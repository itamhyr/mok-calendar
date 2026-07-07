# Deploying Mok Calendar to Cloudflare

This project now deploys via the official **OpenNext Cloudflare adapter**
(`@opennextjs/cloudflare`) instead of the deprecated `@cloudflare/next-on-pages`.
No UI or app logic was touched — only build/deploy tooling.

Note: this uploaded copy of the project didn't actually contain any
`@cloudflare/next-on-pages` files or config to remove, but the setup below
is the current, non-deprecated way to ship it to Cloudflare regardless.

## What changed

| File | Change |
|---|---|
| `package.json` | Added `@opennextjs/cloudflare` + `wrangler` devDependencies, added `preview` / `deploy` / `upload` / `cf-typegen` scripts |
| `next.config.js` | Added `initOpenNextCloudflareForDev()` call (dev-only, lets `next dev` see Cloudflare bindings) |
| `wrangler.jsonc` | **New.** Worker name, entry point, compatibility flags, static assets binding |
| `open-next.config.ts` | **New.** OpenNext Cloudflare config (empty/default — no KV/R2/D1 caching needed for this app) |
| `public/_headers` | **New.** Long-lived caching for `/_next/static/*` and icons; no-cache for `sw.js`/`manifest.json` |
| `.gitignore` | **New.** Ignores `.next`, `.open-next`, `.wrangler`, and the `next-pwa`-generated service worker files |
| `tsconfig.json` | Excludes `.open-next` from type checking |

**Important version note:** `@opennextjs/cloudflare` is pinned to `1.15.1`.
Cloudflare has dropped active Next.js 14 support in newer adapter releases
(1.16+ requires Next 15/16) — `1.15.1` is the last version whose peer
dependencies accept Next `14.2.35`, matching this project exactly. If you
later upgrade to Next.js 15+, you can bump `@opennextjs/cloudflare` to the
latest version too.

## One-time setup

```bash
npm install
npx wrangler login
```

`npm install` will regenerate `package-lock.json` with the new dependencies.

## Local preview (runs in the real Workers runtime via wrangler, not `next dev`)

```bash
npm run preview
```

This builds the app, converts it with OpenNext, and serves it locally with
`wrangler dev` so you're testing the same runtime (`workerd`) Cloudflare
will actually run in production — not Node.js.

## Deploy to Cloudflare Workers

```bash
npm run deploy
```

This runs `opennextjs-cloudflare build` (Next.js build → OpenNext transform)
and then `opennextjs-cloudflare deploy` (`wrangler deploy` under the hood).
On first deploy, Wrangler will prompt you to confirm the Worker name/account
if not already configured, and will print your `*.workers.dev` URL.

If you'd rather upload a version without immediately serving it (e.g. for
gradual rollout), use:

```bash
npm run upload
```

## Before your first deploy

1. Open `wrangler.jsonc` and set `compatibility_date` to today's date (it's
   pre-filled, but keep it current on future deploys).
2. If you want a custom domain instead of `*.workers.dev`, add it under
   **Workers & Pages → your worker → Settings → Domains & Routes** in the
   Cloudflare dashboard, or add a `routes` entry to `wrangler.jsonc`.

## PWA behavior

`next-pwa` still generates `public/sw.js` and the `workbox-*.js` runtime at
build time exactly as before — this is untouched. `_headers` ensures the
service worker file itself is never cached by the CDN (so PWA updates
propagate), while hashed static JS/CSS and icons are cached for a year.

## Notes

- Edge Runtime (`export const runtime = "edge"`) is not used anywhere in
  this app, which is required for `@opennextjs/cloudflare` — Node.js
  runtime is used instead.
- No Cloudflare bindings (KV/R2/D1) are configured because this app doesn't
  need them — it's a fully static/client-rendered calendar. `open-next.config.ts`
  is left at its defaults for that reason.
- The full build was verified locally with
  `npx opennextjs-cloudflare build`, producing a valid `.open-next/worker.js`
  and `.open-next/assets` (including the PWA files and `_headers`).
