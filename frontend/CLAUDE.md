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
- `src/components/shop/ShopFilterRail.tsx` + `ShopFilterDrawer.tsx` — Shop All filter UI (rail on desktop, drawer on mobile); `ShopFilterSection.tsx` is the shared chip-radio primitive. Rail collapse state persists in `localStorage` under `seijaku.shopFilterRail.collapsed`
- `src/components/howSeijakuWorks.options.ts` — editable option data for the "Choose a scent" and "Choose an artifact" dropdowns in the Home Page "How Seijaku works" section. Add a new option by appending to the relevant step's `items` array; no component edit required
- `src/app/seasonaldrops-hemanta/*` — canonical Hemanta seasonal-drop page. `/seasonaldrops` is a redirect kept for bookmark continuity; future drops should mirror this pattern (`/seasonaldrops-<slug>`). Reserve buttons on the Four Forms section open `ProductDetailDrawer` for the matching `hemanta-<name>` entries in `shopProducts`
- `/shop/seasonaldrops` — browsable bridge (generic `ShopBridgePageClient`) surfacing the diffuser sets from whichever drops are currently active. Editorial stories still live on `/seasonaldrops-<slug>`. Add a new drop by appending its product slugs to the `seasonaldrops` entry in `shopBridgePages`
- `ShopProduct.customizationOptions` — optional per-product variant pickers (label + values + required flag). When set, `ProductDetailDrawer` renders a `<select>` per option and gates Buy Now until every required option is chosen
- **Drawer video enrichment:** `ProductDetailDrawer` lazily fetches `/api/public/catalog/products/:slug` on open and falls back to any `VIDEO`-kind media attached to the matching backend record when the frontend registry's `videoUrl` is empty. Single 8-second-bounded fetch, silent on any failure. Hand-maintained `videoUrl` in `shopAllItems.ts` always wins. Closes the gap where admin-uploaded videos would not otherwise surface without a registry edit
- **`ShopItemType` free-text extension:** the union in `shopAllItems.ts` is a TypeScript-only type — the backend `Product.type` is free-text, so adding a new value (e.g. `"Fragrance Oil"`, `"Wax Melt"`) is a frontend-only change. Shop All filter dropdowns rebuild from the union automatically via `getShopTypes()`. Curated bridge pages (`DiffusersPageClient`, `PerfumesPageClient`, etc.) show hand-picked product lists and don't auto-include new products; incorporating a new product into one of those pages is a separate edit
- **`LifestyleSetField` selection modes:** fields default to SINGLE (`<select>` dropdown). Set `selectionMode: "MULTI"` + `minSelections` + `maxSelections` for a checkbox list with hard-cap enforcement (unchecked rows disable once `maxSelections` is hit). Selected values become `string[]` for MULTI fields vs `string` for SINGLE — hence the `LifestyleFieldValue = string | string[]` alias. Live Calm Gift Pouch's picker options derive from `shopProducts` at module load (filtered by `bridgeCategory` + buyable status), so new perfumes/textiles/brooches auto-appear without editing the config
- **Admin sync-new-products:** `components/admin/SyncRegistryButton.tsx` ships a SUPER_ADMIN-only button on `/admin/products` that posts the frontend `shopProducts` registry to `POST /api/admin/proxy/products/sync-new`. Backend creates only slugs that don't already exist in the admin DB (hand-edited records are preserved) inside a single Prisma transaction. Use after adding new products to `shopAllItems.ts` so they become admin-manageable without running `prisma:seed` against prod
- `src/components/admin/*` — admin shell and editors; call `/api/admin/proxy/*` from the client
- `src/lib/admin-session.ts` — signed httpOnly cookie helpers (server-only)
- `src/lib/admin-backend.ts` — typed admin API fetcher for server components (redirects to `/admin/login` on 401)
- `src/lib/backend.ts` — low-level backend fetch used by both public proxy and admin helpers
- `src/lib/shopAllItems.ts` — **current** storefront source of truth
- `src/lib/categoryBridge.ts` — **legacy**, do not extend

## Patterns To Follow

- **Server component → backend data:** use `adminBackendJson()` (from `src/lib/admin-backend.ts`, pins `no-store`) for admin pages, or `publicBackendJson(path, { revalidate, tags })` (from `src/lib/backend.ts`, ISR-cached) for public pages. Always pass an explicit `tags: CacheTag[]` on public reads — the admin BFF proxy invalidates by tag on writes via `tagsForAdminWrite()` in `src/lib/cache-tags.ts`. Do not call `fetch()` directly from components. Decision #15.
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
