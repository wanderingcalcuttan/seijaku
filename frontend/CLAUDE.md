# CLAUDE.md — frontend workspace

Complements the repo-root `CLAUDE.md`. Read that first.

## Stack

Next.js 16 App Router, React 19, TypeScript strict, Tailwind 4, Framer Motion. Self-hosted fonts in `src/app/fonts/`. Turbopack dev.

## Key Paths

- `src/app/(marketing)/` — homepage route group
- `src/app/shop/`, `src/app/shop/[slug]/` — canonical commerce routes
- `src/app/admin/(auth)/login/` — public admin login
- `src/app/admin/(protected)/*` — session-gated admin pages; layout enforces auth
- `src/app/api/admin/session/route.ts` — login/logout/session lookup (BFF)
- `src/app/api/admin/proxy/[...path]/route.ts` — attaches bearer token, proxies to backend `/admin/*`
- `src/app/api/public/[...path]/route.ts` — passthrough to backend public endpoints (newsletter, orders, reservations, inquiries)
- `src/components/AppShell.tsx` — splits marketing chrome from `/admin` chrome based on pathname
- `src/components/shop/{diffusers,lifestyle,perfumes,textiles}/*` — per-bridge custom clients; `ShopBridgePageClient.tsx` is the generic fallback (currently only used for `dokra-ornaments`)
- `src/components/admin/*` — admin shell and editors; call `/api/admin/proxy/*` from the client
- `src/lib/admin-session.ts` — signed httpOnly cookie helpers (server-only)
- `src/lib/admin-backend.ts` — typed admin API fetcher for server components (redirects to `/admin/login` on 401)
- `src/lib/backend.ts` — low-level backend fetch used by both public proxy and admin helpers
- `src/lib/shopAllItems.ts` — **current** storefront source of truth
- `src/lib/categoryBridge.ts` — **legacy**, do not extend

## Patterns To Follow

- **Server component → backend data:** use `adminBackendJson()` for admin pages or `publicBackendJson()` for public pages. Do not call `fetch()` directly from components.
- **Client editor → backend write:** POST/PATCH to `/api/admin/proxy/<endpoint>`, never directly to the backend. The proxy attaches the bearer token from the httpOnly cookie.
- **Auth in server components:** call `requireCurrentAdmin()` at the top; it redirects to `/admin/login` on missing/invalid session.
- **Path alias:** `@/*` resolves to the workspace root (`frontend/`). Import from `@/src/lib/...`, not relative.
- **Route groups** (`(marketing)`, `(auth)`, `(protected)`) exist to swap layouts without leaking into the URL. Do not remove them without adjusting the shell.
- **Shop product CTAs:** `components/shop/ShopProductActions.tsx` is the canonical Buy Now / View Details / Add to Wishlist row. Compose it from every product card instead of hand-rolling the three buttons. Cards with variant selectors pass `isBuyDisabled` + `selection`; cards without selectors pass neither. The component switches the primary slot automatically: products in `notifiableStatuses` (currently just `"Waitlist"`) render **Notify Me** which opens `NotifyMeModal` (POSTs to `/api/public/lead/product-notifications`); products in `unbuyableStatuses` (`"Sold Out"`, `"Upcoming"`) render a muted status pill instead of any primary CTA. See `src/lib/shopAllItems.ts` for the helpers and `DECISIONS.md#14` for the rationale.

## Dev Server

```bash
npm run dev                 # from frontend/
```

or from repo root:

```bash
npm run dev:frontend
```

Port 3000 default, falls through to 3001 if busy. Admin login: `/admin/login`.

## Build & Typecheck

```bash
npx tsc --noEmit            # typecheck only
npm run lint                # eslint
npm run build               # full Next build (used by Vercel)
```

`NEXT_IGNORE_INCORRECT_LOCKFILE=1` is set in dev/build scripts — do not remove. Sharp is pinned for image optimization; don't drop it. Optional deps `@tailwindcss/oxide-linux-x64-gnu` and `lightningcss-linux-x64-gnu` are pinned for Vercel Linux builds.

## Env Vars

- `BACKEND_INTERNAL_URL` — base URL for backend (default `http://localhost:4001`). Must be set in Vercel Preview+Production.
- `ADMIN_COOKIE_NAME` — optional, defaults to `seijaku-admin-session`.
- `ADMIN_COOKIE_SECRET` — HMAC secret for the admin session cookie. Required in Vercel Preview+Production.

No `NEXT_PUBLIC_*` vars in use — all backend access is server-side by design.

## Common Gotchas

- `AppShell.tsx` checks `pathname.startsWith("/admin")` to skip marketing chrome. Adding a new top-level admin-adjacent route needs the same check.
- The `/shop-all`, `/lifestyle`, `/categories/[slug]` routes still exist as compatibility. New code should link to `/shop` and `/shop/[slug]`.
- If you add a new admin editor that uploads files, remember to pass `multipart/form-data` through — both proxy routes handle that case already; don't bypass the proxy.
- Turbopack dev is the default in Next 16 for this project. If something builds in prod but not dev (or vice versa), note that explicitly before debugging.
