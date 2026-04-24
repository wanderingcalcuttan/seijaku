# Seijaku Decisions

## Purpose

This file records project-level decisions that should remain true unless the team deliberately changes direction.

## Current Decisions

### 1. `/shop/*` Is The Canonical Public Commerce Route Family

Status: Active

The primary public commerce experience lives under:

- `/shop`
- `/shop/[slug]`

Older paths such as `/shop-all`, `/lifestyle`, and `/categories/[slug]` are compatibility routes, not the primary model.

### 2. `frontend/src/lib/shopAllItems.ts` Is Still The Public Storefront Source Of Truth

Status: Active

For the currently rendered storefront, shop structure and product presentation are still driven from:

- `frontend/src/lib/shopAllItems.ts`

Until the storefront is migrated to backend content APIs, this file remains authoritative for what the public shop shows.

### 3. `frontend/src/lib/categoryBridge.ts` Is Legacy

Status: Active

`frontend/src/lib/categoryBridge.ts` reflects the older `/categories/*` and `/shop-all` era. New work should not treat it as canonical.

### 4. The Standalone Backend In `backend/` Is The System Of Record For Admin, Leads, And Normalized Content

Status: Active

The backend owns:

- admin auth
- normalized catalog/content tables
- media records
- lead persistence
- admin dashboard aggregates

That backend is authoritative for database-backed operations even though the public storefront is not fully reading from it yet.

### 5. Admin Lives Inside The Next App Under `/admin`

Status: Active

The admin UI is embedded in the Next app rather than being a separate frontend.

The backend remains separate, but the browser reaches it through the Next app's BFF/proxy layer.

### 5a. The Repo Is A Two-Workspace Monorepo

Status: Active

The repo is intentionally split into:

- `frontend/`
- `backend/`

Docs and workspace tooling stay at the root. This keeps frontend and backend installs cleanly separated while preserving one repository.

### 6. Admin Sessions Use A Signed HttpOnly Cookie Through Next

Status: Active

The browser should not hold raw backend bearer tokens in JavaScript storage.

Current model:

- backend returns JWT
- Next signs and stores it in an httpOnly cookie
- browser code talks to `/api/admin/*` inside the frontend workspace

### 7. Admin Roles Are `SUPER_ADMIN` And `EDITOR`

Status: Active

Current role boundary:

- `SUPER_ADMIN` manages admins, settings, and destructive or publish-level actions
- `EDITOR` manages day-to-day content, media, and lead operations

### 8. Public Reads And Public Writes Are Intentionally Split For Now

Status: Active

Current architecture:

- most public reads still come from frontend files in `frontend/src/lib`
- public writes for newsletter, checkout, program reservations, and retreat inquiries go to the backend

This split is intentional for the current migration stage, but it is also the main source-of-truth risk in the repo.

### 9. Documentation Must Be Updated When Sources Of Truth Move

Status: Active

Structural changes must be reflected in repo docs, especially:

- [README.md](./README.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [CONTENT_MODEL.md](./CONTENT_MODEL.md)
- [WORKFLOWS.md](./WORKFLOWS.md)
- [DECISIONS.md](./DECISIONS.md)
- [backend/README.md](./backend/README.md)

### 10. Production Prisma Migrations Run In The Deploy Build

Status: Active

Migrations are applied automatically on every production deploy. The mechanism depends on the backend host:

- On Render (current): build command is `npm install && npm run build && npm run prisma:deploy`, which applies pending migrations before the new process starts.
- On Vercel (historical, pre-Decision #13): `backend/scripts/vercel-build.sh` ran `prisma migrate deploy` when `VERCEL_ENV=production`.

A failed migration fails the deploy. The previous process keeps serving until the next successful build. Destructive or long-locking migrations should still be audited manually before merge.

Rationale: remove the per-deploy human step that was previously required, which was a known source of 500s after a schema change merged without the operator remembering to run `prisma migrate deploy`.

### 11. Production Backend CORS Is Locked To The Canonical Frontend Alias

Status: Active

`CORS_ORIGIN` on the backend Production scope is pinned to `https://seijaku-kappa.vercel.app` (comma-separated — add the `www.seijaku.co` custom domain to the list when convenient).

The browser never calls the backend directly in normal flows — all traffic goes through the Next BFF on the frontend domain as server-to-server fetches, which are not subject to CORS. Locking prod CORS closes the direct-from-browser path while not affecting any real request path.

### 12. Production Object Storage Is Supabase Storage

Status: Active

Media uploads in production go to the Supabase Storage bucket `seijaku-media-prod` in us-east-1. Public-read; uploads authenticated with S3-compatible access credentials that bypass Supabase RLS. Backend accesses via the existing S3 driver in `backend/src/lib/storage.ts` — no Supabase SDK dependency.

Path taken to get here:
- **Attempt 1 (rejected):** Vercel Blob in PRs #7 and #8. Both hung the serverless function on cold start. Root cause unconfirmed; likely Vercel Blob integration auto-wiring colliding with the `@vercel/node` + Express pipeline. Reverted in PR #9.
- **Attempt 2 (rejected):** Cloudflare R2. 10 GB free but requires a credit card for verification. User preferred no-card option.
- **Current:** Supabase Storage. 1 GB free, no card, S3-compatible API.

The S3 driver is provider-agnostic: swapping to R2/B2/AWS later is an env-var change. No Supabase lock-in in the code.

Known limits: Supabase Storage free tier is 1 GB. Upgrade path is (a) pay Supabase, (b) migrate to R2 when a card is available.

### 13. Backend Runs On Render Free (Not Vercel)

Status: Active

The Express backend runs as a long-running Node process on Render Free (`seijaku-backend.onrender.com`). Auto-deploys on push to `main`. Free tier sleeps after 15 minutes of inactivity; first request after idle waits 30-50 seconds to wake up. Subsequent requests are sub-second.

Why not Vercel serverless:

- Vercel Hobby tier has a 10-second function duration cap. The backend bundle (Prisma + AWS SDK + Express) exceeded that on cold start, producing deployments that built successfully but hung on first request.
- Vercel serverless filesystem is ephemeral; local uploads are lost on container recycle. A real storage backend was needed regardless.
- The backend is a long-running Express app; the serverless single-function-per-request model fits poorly.

Trade-offs on Render Free:

- Admin login after idle periods waits 30-50s for wake-up. Public-facing storefront reads are still fast because most public pages render from frontend registries (see Decision #8); only backend-routed requests (admin, lead submissions) hit the wake-up.
- Upgrade path: Render Starter tier ($7/mo) removes the wake-up. Worth revisiting when real users are hitting admin or lead-capture routes during idle hours.

Vercel-specific scaffolding (`backend/vercel.json`, `backend/api/index.ts`, `backend/scripts/vercel-build.sh`, `npm run vercel-build`) has been removed from `backend/`. The standalone `seijaku-backend` Vercel project is scheduled for deletion.

### 14. Notify Me Captures Lead-Only; Automated Dispatch Is Deferred

Status: Active

The "Notify Me" form on waitlisted products persists a `ProductNotification` record keyed by product slug + email (idempotent upsert). Admins process these in `/admin/leads` like any other lead type.

Trigger criteria on the public storefront:

- frontend `status === "Waitlist"` → renders the Notify Me button
- `status === "Sold Out"` or `"Upcoming"` → renders a muted status pill instead of any primary CTA (no capture)
- everything else → renders Buy Now as today

Automated *customer-facing* "it's back" dispatch is intentionally out of scope. That decision pulls in provider selection (Resend / SES / SMTP), credential management, retry/backoff, bounce handling, unsubscribe links, and webhook signing — each a separate correctness surface. Revisit when real notification volume justifies it.

A small *admin-facing* ping lives in `backend/src/lib/notifier.ts` as a stub (logs the payload; does not call any external provider). Env vars `ADMIN_NOTIFICATION_EMAIL`, `NOTIFIER_FROM_EMAIL`, `RESEND_API_KEY` are scaffolded in `config.ts` and `.env.example` so swapping in a real dispatcher later is a single-file change with no infra plumbing. The helper is invoked fire-and-forget **after** the public endpoint has already responded 201 — a failing or slow notifier can never delay or fail the customer-facing submission.

Rate limiting on the public endpoint is deferred. The `@@unique([productId, email])` constraint bounds per-pair duplication, and Zod length limits (254 for email, 200 for slug) block the worst payloads. Add IP-based throttling when real traffic patterns emerge.

### 15. Public Backend Reads Use ISR With Tag-Based On-Demand Invalidation

Status: Active

As the frontend starts migrating public reads from `frontend/src/lib/*.ts` registries to backend APIs, the caching contract is:

- Public server fetches go through `publicBackendJson(path, { revalidate, tags })` in `frontend/src/lib/backend.ts`. Default `revalidate` is 60 seconds. Callers must pass an explicit `tags: CacheTag[]` so admin writes can target the right data.
- Admin fetches go through `adminBackendJson(...)` in `frontend/src/lib/admin-backend.ts`, which pins `cache: "no-store"`. Admin responses must never land in Next's Data Cache — they are per-session and token-authenticated.
- The tag registry lives in `frontend/src/lib/cache-tags.ts`. It is the single source of truth for valid tags and for the `tagsForAdminWrite(upstreamPath)` map that the admin BFF proxy uses to decide what to invalidate after a successful write.
- `/api/revalidate` (secret-gated by `REVALIDATE_SECRET`, POST-only) accepts `{ tags?, paths? }` and calls `revalidateTag` / `revalidatePath`. Unknown tags return 400 so typos fail loudly.
- The admin proxy (`/api/admin/proxy/[...path]`) calls `/api/revalidate` after a successful non-GET response. Bounded by a 2-second AbortController timeout and exactly one attempt — failure is logged and swallowed; content becomes stale for up to one ISR window.

Rationale:

- The backend runs on Render Free (Decision #13) and sleeps after 15 min of idle. Per-request fan-out would add 30-50 s cold-start latency to public pages; ISR insulates visitors from that.
- Admins expect edits to appear on public without a redeploy. Tag-based invalidation keeps freshness within seconds of a write, without a polling loop or a background worker.
- Keeping admin and public cache rules in one file (`backend.ts` + `cache-tags.ts`) prevents each new migrated page from re-deciding its own caching posture.

Trade-offs:

- First-ever visit after a deploy still hits Render cold. Accepted for now; revisit with a keep-warm cron (Render add-on, not a recursive fetch) when real traffic patterns warrant.
- Unknown admin paths return `[]` from `tagsForAdminWrite`, which fails safe (stale) rather than over-invalidating. Every new admin resource added to `backend/src/routes/admin.ts` must also be mapped in `tagsForAdminWrite`, or its edits won't surface on public until the ISR window expires.
- `REVALIDATE_SECRET` is required in every environment (local, Preview, Production). Missing secret = admin writes still succeed but revalidation skips with a server-side warning.

### 16. Articles Are Backend-Owned (First Migrated Domain)

Status: Active

The `/a-seijaku-life` index and `/a-seijaku-life/[slug]` detail pages read from the backend, not from a frontend registry. The frontend registry `frontend/src/lib/seijakuLifeArticles.ts` has been deleted.

Read path:

- Server components call `fetchArticles()` / `fetchArticle(slug)` in `frontend/src/lib/seijaku-life-types.ts`.
- Those helpers wrap `publicBackendJson("/content/articles", { tags: ["articles"] })` (and the slug variant). Cached by Next's Data Cache with the 60-second default `revalidate` from Decision #15.
- Admin edits in `/admin/articles` flow through the BFF proxy, which invalidates the `articles` tag via `/api/revalidate`. Public reads pick up the new content within seconds.
- Both page routes are marked `export const dynamic = "force-dynamic"` so they render per request. The Data Cache still absorbs backend traffic via the fetch-level tag cache; this opts out of the Full Route Cache only, not the Data Cache. Rationale: Render Free wake-up during a Vercel build can fail prerender, so we do not prerender these routes at build time.

UI decisions made during migration:

- Category filter chips on the index are derived dynamically from the fetched categories (`getArticleCategories()` returns `["All", ...distinct sorted]`). Admins can add new categories without code changes. The tradeoff is that typos become visible on the public site until the admin fixes them.
- The `[slug]` route no longer uses `generateStaticParams`. New articles become reachable as soon as admin saves, not at the next deploy.
- Article `date` is computed on the frontend from backend `publishedAt` via a small `"March 2026"` formatter — no schema change was needed to preserve the display style.

Seed impact:

- `backend/prisma/seed.ts` previously imported from the frontend registry. It now imports from a new `backend/prisma/seed-data/articles.ts` module so the backend seed has no dependency on the frontend.

This is the first domain migration under the post-Phase-0 caching contract (Decision #15). The same pattern is expected for Retreats, Programs, Shop Bridge Pages, and Products in later phases.

### 17. Retreats Are Backend-Owned; `imagePosition` Dropped

Status: Active

The `/experiences` retreat gallery and `/retreats/[slug]` detail page read from the backend. The frontend registry `frontend/src/lib/retreats.ts` has been deleted.

Read path:

- Server components call `fetchRetreats()` / `fetchRetreat(slug)` in `frontend/src/lib/retreat-types.ts`.
- Those helpers wrap `publicBackendJson("/content/retreats", { tags: ["retreats"] })` (and the slug variant). Cached by Next's Data Cache with the 60-second default `revalidate`.
- Admin edits on `/admin/retreats` invalidate the `retreats` tag via `/api/revalidate`, so public reads reflect within seconds.
- `/experiences/page.tsx` and `/retreats/[slug]/page.tsx` are marked `export const dynamic = "force-dynamic"` to avoid build-time fetches (same rationale as Decision #16 — Render Free cold-start could fail a Vercel build). The fetch-level Data Cache still absorbs backend traffic.

Field parity and the `imagePosition` decision:

- The old frontend registry had a per-retreat `imagePosition` string (Tailwind class such as `object-[center_46%]`) describing where the cover image crop should focus. The backend `Retreat` model has no equivalent field.
- Phase 2 dropped the feature. All retreat images now render with `object-cover object-center`. The four seeded retreats may show a slightly different crop.
- A proper fix is tracked as a follow-up: introduce a focal-point field on `MediaAsset` so every domain (products, articles, retreats, future hero banners) can share the behaviour. Not in Phase 2's scope.

Seed impact:

- `backend/prisma/seed.ts` previously imported from the frontend registry. It now imports from `backend/prisma/seed-data/retreats.ts`, following the Phase 1 pattern for articles.

Known existing inconsistency (not introduced by Phase 2): the public `/content/retreats` endpoint returns records of every `status`, including `DRAFT`. Articles filter to `PUBLISHED` only. Worth harmonising in a follow-up backend change; outside Phase 2's read-swap scope.

### 18. Programs Are Backend-Owned (Three Routes Collapsed Into One)

Status: Active

The `/programs` index and program detail pages read from the backend. The previous hand-maintained route files `frontend/src/app/programs/adult-unwind/page.tsx`, `.../elder-reset/page.tsx`, and `.../teen-senses/page.tsx` have been replaced by a single dynamic `/programs/[slug]/page.tsx` template.

Read path:

- Server components call `fetchPrograms()` / `fetchProgram(slug)` in `frontend/src/lib/program-types.ts`.
- Those helpers wrap `publicBackendJson("/content/programs", { tags: ["programs", "program-sessions"] })` (and the slug variant). Both tags are included on every read so admin edits on either resource invalidate the cache.
- Admin edits in `/admin/programs` and `/admin/program-sessions` invalidate their respective tags via `/api/revalidate`; public reads reflect within seconds.
- Both routes marked `export const dynamic = "force-dynamic"` for the same reasons as Decisions #16 and #17 — Render Free cold-start could fail a Vercel build.

UI decisions made during migration:

- Three hardcoded detail routes collapsed into one. Existing URLs (`/programs/adult-unwind` etc.) still resolve through the `[slug]` catch-all. New program slugs created in admin become reachable without a deploy.
- The "Featured Upcoming Program" block on `/programs` is data-driven: first program with `status === "BOOKING_OPEN"` that has at least one future session whose status is `UPCOMING` or `BOOKING_OPEN`, using the earliest such session for date/time/seats/location. If nothing qualifies, the block is hidden and the hero's "View Upcoming Program" CTA hides with it. Admins control visibility by adjusting program status + adding sessions.
- The detail template renders `detailDescription` with `whitespace-pre-line` so admin-authored paragraph breaks survive without requiring a markdown renderer. A "Upcoming Sessions" panel appears only when at least one future session exists (capped at 3).
- `ProgramReservationForm` was already backend-fed and is unchanged.

Dropped from the UI (not migrated):

- `sessionFlow` (a 5-bullet "what the session includes" list previously hardcoded only on the Elder Reset page). A structured "What's included" list is a natural candidate for Phase 5's block-level work. If an admin needs to surface the list now, it can be typed into `detailDescription` prose.
- `trustNotes` and `expectations` arrays on `/programs` (small marketing decoration) remain hardcoded page-level copy. Phase 5 block work covers that territory.

Pre-existing inconsistency flagged (not introduced by Phase 3): the public `/content/programs` and `/content/retreats` endpoints return records of every status, including `DRAFT`. `/content/articles` filters to `PUBLISHED`. A single follow-up backend pass can harmonise the three endpoints.

### 19. Shop Bridge Pages Are Backend-Owned (Products Still Frontend — Phase 4a)

Status: Active

The six shop bridge pages (`/shop/lifestyle`, `/shop/perfumes`, `/shop/scarves-and-squares`, `/shop/diffusers`, `/shop/dokra-ornaments`, `/shop/seasonaldrops`) now read their **page metadata** from the backend. Products on those pages still come from the frontend `shopProducts` registry — that migration is Phase 4b.

Read path:

- `/shop/[slug]/page.tsx` calls `fetchBridgePage(slug)` in `frontend/src/lib/bridge-page-types.ts`, which wraps `publicBackendJson("/catalog/bridge-pages/:slug", { tags: ["bridge-pages", "products"] })`. The page is marked `export const dynamic = "force-dynamic"` for consistency with Decisions #16–#18.
- Admin edits on `/admin/bridge-pages` invalidate both tags via `/api/revalidate`.
- The five per-bridge page clients (LifestylePageClient, PerfumesPageClient, TextilesPageClient, DiffusersPageClient, and the generic ShopBridgePageClient) were not touched. `bridge-page-types.ts` preserves the exact `ShopBridgePageConfig` shape they already consume via a `normalize()` mapper.

Schema migration (first since the initial schema):

- `backend/prisma/migrations/0004_bridge_page_extras/migration.sql` adds columns to `ShopBridgePage`: `heroImage`, `heroImageAlt`, `heroImagePosition`, `interludeImage`, `interludeImageAlt`, `productSectionEyebrow`, `productSectionTitle`, `productSectionDescription`, `seoFootnote`.
- `heroImage` and `heroImageAlt` are NOT NULL with empty-string defaults (safe on existing rows; seed backfills real values immediately).
- All other additions are nullable. Fully reversible.
- Render's build runs `prisma migrate deploy` automatically (Decision #10); first real exercise of that path since schema churn slowed.
- Hero/interlude images are stored as string paths (`"/images/..."`) matching the existing frontend style. A cross-domain move to `MediaAsset` FKs across articles / retreats / bridge pages is tracked as a follow-up (same focal-point follow-up flagged in Decision #17).

Admin UX:

- `/admin/bridge-pages` now has typed text/textarea fields for all 9 new columns. Existing admin rows open cleanly with empty values for the new fields.

Seed change:

- `backend/prisma/seed-data/bridge-pages.ts` is the new source of truth for bridge-page seed fixtures (6 entries). `backend/prisma/seed.ts` no longer depends on the frontend workspace for bridge-page metadata. It still reads `shop.shopProducts` for product records — that dependency clears when Phase 4b lands.
- Seed's `bridgePageMeta` hand-maintained map was removed.

Frontend cleanup:

- `shopBridgePages`, `ShopBridgePageConfig`, `getShopBridgePageBySlug`, and `canonicalBridgeSlugs` were removed from `frontend/src/lib/shopAllItems.ts`. `ShopBridgeSlug` is re-exported from `bridge-page-types.ts` for backward-compatible imports.
- `getShopBridgeProducts(slug)` stays in `shopAllItems.ts` but now uses a local static `bridgeProductSlugs` map (inlined from the old `productSlugs` arrays) so per-bridge product ordering is preserved during Phase 4a. Map is deleted in Phase 4b.
- Client components (`SearchOverlay`, `Navbar` if ever needed) use a small static `bridgeNavLabelBySlug` + `bridgeHrefBySlug` exported from `bridge-page-types.ts`. These are code-owned on purpose — they are UI navigation labels, not editorial content, and don't need to roundtrip the backend on every client render.

Phase 4b will migrate `shopProducts` itself. That's a large surface (checkout, cart, lifestyle option dropdowns, product detail drawer, nav, filter helpers) and warrants its own session — likely split further into a read migration + a checkout/cart migration.

### 20. `/shop/[slug]` Product Lists Are Backend-Fed (Phase 4b.i)

Status: Active

Narrow continuation of Decision #19. The six `/shop/[slug]` pages now source their product lists from the backend bridge-page response (`GET /catalog/bridge-pages/:slug` — `item.products`). Every other consumer of `shopProducts` (home featured sets, shop-all grid, shop-all filter helpers, search overlay, cart, checkout, Navbar lookups, Lifestyle Gift Pouch option dropdowns, seasonal-drops page, HowSeijakuWorks) still reads the frontend `shopProducts` registry. Phase 4b.ii (and later) sequence the remainder.

Read path:

- `normalize()` in `frontend/src/lib/bridge-page-types.ts` now calls `normalizeBackendProducts(backend.products)` and exposes `products: ProductView[]` on the returned `ShopBridgePageConfig`. `productSlugs` is derived from those products.
- `ProductView` is a structural subset of `ShopProduct` (it drops `ritualTag` + `ritualTagHref`) so the five page clients (`LifestylePageClient`, `PerfumesPageClient`, `TextilesPageClient`, `DiffusersPageClient`, generic `ShopBridgePageClient`) accept the prop with no changes.
- `/shop/[slug]/page.tsx` no longer calls `getShopBridgeProducts`; it passes `page.products` straight through.
- `getShopBridgeProducts` and the inline `bridgeProductSlugs` map (introduced in Decision #19) are deleted.

Normalizer behaviour:

- Maps backend `priceAmount` + `currency` to the hand-formatted `priceLabel` pattern (`"INR 6,800"`) — backend stores whole rupees, not paise, per the current seed.
- Maps the `status` enum (`"IN_STOCK"`, `"WAITLIST"`, etc.) to the display strings (`"In Stock"`, `"Waitlist"`) that `ShopProductActions` and friends already branch on.
- Derives `gallery` from non-primary `IMAGE` media, `videoUrl` from the first `VIDEO`-kind asset, `image` from `primaryImage` (with a placeholder fallback when neither is set).
- Flattens `ProductOption[] → customizationOptions[]` by taking each value's `label` into a `string[]`.
- Drops products with `workflowStatus === "DRAFT"` from the returned list — `/shop/[slug]` now respects admin drafting without a backend endpoint change.

Dropped fields:

- `ritualTag` / `ritualTagHref`: no equivalent on the backend `Product` model. Three lifestyle products previously used these to surface a small tag under the card price. Cosmetic drop; reintroduce via `metadataJson` or a dedicated column later if it matters.

Admin effects:

- Bridge-page product assignments can now be managed entirely in `/admin/bridge-pages` (product pick list already editable). Adding a new product to a bridge page no longer needs a code change.
- Admin edits to a `Product` record (title, description, status, media, customization options) surface on the bridge page within ~2 seconds via the Phase-0 `products` tag invalidation (the fetch tag list already includes both `bridge-pages` and `products`).

Phase 4b.ii and beyond:

- Phase 4b.ii: migrate `/shop-all`, `SearchOverlay`, `RitualSetsSection` (home featured sets), `MenuSlider`, `SeasonalDropsPage`, and lifestyle option dropdowns to read backend products.
- Phase 4b.iii: migrate cart + checkout so prices and titles come from the backend.
- Phase 4b.final: delete `shopProducts` + related helpers/types from `shopAllItems.ts`.

### 21. `/shop` (Shop-All) Reads from Backend (Phase 4b.ii)

Status: Active

The canonical `/shop` route now fetches its full product list from `/catalog/products` (via `fetchProducts()` in `frontend/src/lib/product-types.ts`) and hands it to `ShopAllPageClient` as a prop. Filter / sort / search remain client-side over the prop list — no extra network calls per interaction. Draft products are filtered at the backend (`/catalog/products` only returns `workflowStatus === "PUBLISHED"`), so drafts never leak.

Read path:

- Server component `/shop/page.tsx` is `dynamic = "force-dynamic"` and `await fetchProducts()`.
- `ShopAllPageClient` accepts `products: ProductView[]`; `useMemo`-derived `filteredProducts` runs the full filter pipeline client-side.
- `selectedProduct` for the detail drawer is looked up in the prop list (no second fetch).
- Admin product edits invalidate the `products` tag via the Phase-0 proxy → `/api/revalidate` path; `/shop` refetches on next request.

Taxonomy note:

- `getShopTypes()` and `getShopMaterials()` in `shopAllItems.ts` return **static curated filter-chip taxonomies** (e.g. "Fragrances", "Body", "Dokra Ornaments") — they are NOT derived from the product set. They stay in place; no pure-function variant needed.
- Only `useCases` was actually derived from products. `product-types.ts` adds `collectUseCases(products)` as the pure replacement for `getShopUseCases()`.

`/shop-all` is a redirect to `/shop`, so it follows automatically.

Remaining `shopProducts` consumers (home featured sets, `SearchOverlay`, Navbar / MenuSlider, cart, checkout, Lifestyle Gift Pouch option dropdowns, seasonal drops page, `HowSeijakuWorks` options) still read the frontend registry. Phase 4b.iii onwards.

## How To Use This File

- Add a new entry when a structural or cross-cutting product decision is made.
- Update an existing entry when the system deliberately changes ownership or architecture.
- Do not treat accidental drift as an approved decision.
