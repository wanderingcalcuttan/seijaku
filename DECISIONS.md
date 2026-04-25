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

Known existing inconsistency (not introduced by Phase 2): the public `/content/retreats` endpoint returns records of every `status`, including `DRAFT`. Articles filter to `PUBLISHED` only. **Resolved** in a post-migration cleanup PR — both handlers now filter with `{ status: { not: "DRAFT" } }` since `RetreatStatus` has multiple valid public values (UPCOMING, INQUIRY_OPEN, CLOSED) rather than a single PUBLISHED flag.

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

Pre-existing inconsistency flagged (not introduced by Phase 3): the public `/content/programs` and `/content/retreats` endpoints return records of every status, including `DRAFT`. `/content/articles` filters to `PUBLISHED`. **Resolved** in a post-migration cleanup PR — index and by-slug handlers for both domains now filter out `DRAFT` records (programs via `{ status: { not: "DRAFT" } }`, retreats same).

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

### 22. Home/Search Display-Side Consumers Read From Backend (Phase 4b.iii)

Status: Active

The home "Featured Sets" section (`RitualSetsSection`), the global `SearchOverlay`, and the home "How Seijaku works" dropdown thumbnails (`howSeijakuWorks.options.ts`) no longer import from `shopProducts`. `MenuSlider` was confirmed via git history to never have referenced product data and required no change.

Read paths:

- `SearchOverlay` (`"use client"`) lazy-fetches `GET /api/public/catalog/products` the first time the overlay opens and caches the normalized `ProductView[]` in a `useRef` for the component's lifetime. Reopening the overlay within the same page visit does not refetch. Single attempt; on transport failure the overlay shows a quiet "couldn't load" message rather than throwing. The scoring function drops the old `ritualTag` weight (absent from `ProductView` per Decision #20) — minor signal reduction for the three products that previously carried that tag.
- `RitualSetsSection` (`"use client"`) fetches the two `homepageFeaturedLifestyleItems.backingSlug` values in parallel via `GET /api/public/catalog/products/:slug` on mount. Results land in a `Record<slug, ProductView>` state map; the section renders its existing `cards.length === 0 → return null` branch until at least one resolves, matching the pre-migration hiding behaviour. `ProductView` is structurally assignable to `ShopProduct` (the `ritualTag` / `ritualTagHref` drop is optional-only), so `LifestyleSetCard` and `ProductDetailDrawer` props accept it without changes.
- `howSeijakuWorks.options.ts` is now pure static data — the `getShopProductBySlug(slug)?.image ?? fallback` pattern was replaced with hand-written `/images/...` paths for all six dropdown thumbnails. Four of the five backing-slug entries already resolved to the same fallback path; the fifth (`kolkata-summer-modal-silk-scarf`) now renders its actual product image instead of silently falling back to a mismatched placeholder.
- `product-types.ts` gains a `fetchProductBySlug(slug)` server-side helper (tagged `products`) alongside the existing `fetchProducts()`. Not consumed in this phase's changes — both consumers above are client components that hit the public proxy directly — but retained for future server-side parents.

Trade-offs:

- First search after Render Free idle pays the backend cold-start (30–50 s, Decision #13). The overlay input renders instantly; only the results area stays in the loading state until the catalog arrives. Typed queries before fetch completes show an empty-results state until the list lands.
- `RitualSetsSection` renders null for the brief window between mount and the two per-slug fetches resolving. Home page animation chrome (`data-home-reveal` opacity transition) covers the gap.
- `howSeijakuWorks.options.ts` no longer auto-tracks backend product image changes. Editorial content; acceptable per the scope decision to keep it a pure static module. The header comment documents the manual-copy workflow for admins updating a thumbnail.
- Why client-fetch instead of server-prop: both consumers render inside the home page, which is a `"use client"` tree (scroll animations use `useScroll` / `useRef`). A server-hoist would require restructuring home page chrome and adding a full-catalog prop to every layout that renders the Navbar (SearchOverlay's host). Client-fetch trades ~one extra request per visit for a surgical change with no structural blast radius.

Remaining `shopProducts` consumers: cart, checkout, `/collection`, `lifestyleSetConfig.ts` (Lifestyle Gift Pouch picker options), `/seasonaldrops-hemanta`. Phase 4b.iv (lifestyle options), 4b.v (seasonal drops), 4b.vi (transactional — cart + checkout + collection), 4b.final (registry deletion) remain.

### 23. Live Calm Gift Pouch Options Are Backend-Derived (Phase 4b.iv)

Status: Active

`lifestyleSetConfig.ts` no longer imports from `shopProducts`. The Live Calm Gift Pouch's three dropdowns (perfume / textile / brooch) are derived at render time from the already-flowing `ProductView[]` prop via a new `buildLifestyleSections(products)` function.

Read path:

- `/shop/lifestyle/page.tsx` (via `/shop/[slug]/page.tsx`) already fetches `ProductView[]` from `/catalog/products` (Phase 4b.i) and passes it to `LifestylePageClient`.
- `LifestylePageClient` (`"use client"`) now calls `useMemo(() => buildLifestyleSections(products), [products])` to compose the three sections. The 5 cards with hardcoded option lists (Kolkata Chai Calm Box, Coffee Break Box, Unfold / Listen / Attune Ritual Boxes) are extracted to module-scope consts inside `lifestyleSetConfig.ts`. Only the Live Calm Gift Pouch's `fields` depend on `products` — its three `options: string[]` arrays come from `buyableTitlesByBridge(products, bridge)`, which filters out Sold Out / Upcoming / Waitlist products via `isUnbuyableProduct` / `isNotifyMeProduct` and sorts alphabetically.
- `homepageFeaturedLifestyleItems` remains a pure static const (the Morning & Pause pair has no product-derived options), so `RitualSetsSection` continues to use it unchanged.
- `LifestylePageClient`'s drawer-lookup leftover — `getShopProductBySlug(selectedSlug)` — was replaced with the in-prop `productsBySlug.get(selectedSlug)`. The prop type also tightened from `ShopProduct[]` to `ProductView[]` to match runtime reality (a leftover from the Phase 4b.i read-swap).

Trade-offs:

- Backend `status` is now authoritative for picker visibility. If a perfume / textile / brooch shifts between "In Stock" and "Waitlist" / "Sold Out" / "Upcoming" in admin, the Live Calm Gift Pouch dropdowns reflect within one `products` cache-tag window (Phase 0 caching contract, Decision #15). Previously the registry was the source of truth — Phase 4b.iv hands that authority to the backend for this picker.
- `isUnbuyableProduct` / `isNotifyMeProduct` remain in `shopAllItems.ts` with `ShopProduct` parameters. ProductView is cast to ShopProduct inside `buyableTitlesByBridge` — safe because both helpers only read `.status` (a plain string present on both types). Moving the helpers to a ProductView-native location is deferred to Phase 4b.final cleanup.
- No fetches added. No schema changes. No backend edits.

Remaining `shopProducts` consumers: cart, checkout, `/collection`, `/seasonaldrops-hemanta`. Phase 4b.v (seasonal drops), 4b.vi (transactional), 4b.final (registry deletion).

### 24. `/seasonaldrops-hemanta` Drawer Reads From Backend (Phase 4b.v)

Status: Active

The Hemanta seasonal-drop page's four Reserve-button drawers (`hemanta-nandini`, `hemanta-raja-diffuser`, `hemanta-ispani`, `hemanta-rishi-diffuser`) no longer look up products via `getShopProductBySlug`. The route's `page.tsx` is now an async server component that fetches the four slugs in parallel via `fetchProductBySlug` (added Phase 4b.iii) and passes a `Record<slug, ProductView>` prop down to the client component.

Read path:

- `/seasonaldrops-hemanta/page.tsx` is marked `export const dynamic = "force-dynamic"` for the Render Free cold-start reason established in Decisions #16–#21.
- Fetches are tagged `products` via `publicBackendJson`; admin edits to any of the four hemanta products invalidate the cache within one ISR window (Phase 0, Decision #15).
- Missing backend records resolve to `undefined` in the prop map. `selectedProduct` stays `null`, `ProductDetailDrawer`'s `isOpen={Boolean(null)}` stays `false` — a missing slug degrades to a no-op Reserve button rather than a crash.

Prerequisite work:

- All four hemanta products existed in `shopAllItems.ts` but were missing from the backend DB. The SUPER_ADMIN "Sync New Products" button on `/admin/products` (`POST /admin/products/sync-new`) idempotently inserted them. A companion fix (separate PR) bumped the sync endpoint's Prisma transaction timeout from 5 s → 60 s — the full-registry payload exceeded the default interactive-tx window mid-loop.

Unchanged:

- The editorial content in `SeasonalDropsPage.tsx` (hero, letter, making steps, character/scent mapping, four-forms copy, closing blocks, ~1000 lines of inline CSS) remains hardcoded per Decision #8 — route-level editorial copy stays frontend-owned.
- The static `forms` array inside the component (names, philosophies, scents, prices, CTAs) is not migrated — this is editorial framing, distinct from the transactional product record the drawer surfaces.

Remaining `shopProducts` consumers: cart, checkout, `/collection`. Phase 4b.vi (transactional — cart + checkout + collection), 4b.final (registry deletion).

### 25. Checkout, Collection, And Remaining Bridge-Page Drawer Lookups Read From Backend (Phase 4b.vi)

Status: Active

The last non-admin consumers of `shopProducts` and `getShopProductBySlug` migrate to backend reads. After this phase, only `SyncRegistryButton.tsx` (SUPER_ADMIN-only registry-feed tool on `/admin/products`) references the frontend registry — to be deleted alongside `shopAllItems.ts` in Phase 4b.final.

Read paths:

- `CheckoutPageClient` (`"use client"`) lazy-fetches `/api/public/catalog/products/:slug` on mount and whenever `checkoutItemSlug` (from `ShopStateProvider`, `localStorage`-backed) changes. A brief "Loading your selected product…" state covers the fetch; on failure or a slug no longer present in the backend, falls through to the pre-existing "No item is ready for checkout yet" empty state — same degradation the pre-migration registry-miss branch provided.
- `CollectionPageClient` (`"use client"`) fetches every slug in `collection` (the wishlist array from `ShopStateProvider`) in parallel on mount and whenever the list changes. Results land in a `Record<slug, ProductView>` map. Per-slug failures are silently dropped from the rendered list (matches the pre-migration `.filter(Boolean)` behaviour). An `isInitialLoading` flag gates the "Your collection is quiet for now" empty state to avoid a false-empty flash during the first fetch cycle. The drawer reads from the same map.
- Four bridge-page clients — `ShopBridgePageClient`, `DiffusersPageClient`, `PerfumesPageClient`, `TextilesPageClient` — drop their residual `getShopProductBySlug(selectedSlug)` drawer lookups in favor of an in-prop `productsBySlug.get(slug)` map. Each was already receiving `ProductView[]` at runtime via the Phase 4b.i server fetch; prop types tightened from `ShopProduct[]` to `ProductView[]` to match. `ShopBridgePageClient`'s dokra-row dead `ritualTag` / `ritualTagHref` rendering (Decision #20 cosmetic drop) is removed as part of the type tightening.
- `/cart` is a 3-line `redirect(canonicalShopRoutes.collection)` that imports only the static routes object — not a migration candidate.

Trade-offs:

- **LocalStorage slug drift**: if a user has an old slug saved in `localStorage` (from `seijaku-collection` or `seijaku-checkout`) that was since removed from the backend catalog, the saved item silently disappears instead of rendering from the historical registry entry. This is an expected consequence of making the backend authoritative. Mirrors the "silently drop" behaviour established for collection filtering.
- **Cold-start flash**: first visit after Render Free idle pays the 30–50 s wake-up. `/collection` shows a dedicated "Loading your collection…" state; `/checkout` shows a dedicated "Loading your selected product…" state. Returning visitors hit Next's Data Cache via the ISR tag window.
- **Parallel fetches on `/collection`**: N slugs → N per-slug proxy requests per visit. Typical collection size is small (<10). If power users with dozens of saved items make this a hot path, a bulk-by-slug backend endpoint is the obvious follow-up. Out of scope for this phase.
- No schema changes. No backend edits. No server-parent conversions needed (the consumer components already owned their own `"use client"` state tree).

Remaining `shopProducts` consumer: `SyncRegistryButton.tsx` only. Phase 4b.final deletes `shopAllItems.ts`, drops the sync button (which becomes obsolete once the registry is gone), and closes the migration arc started in Phase 1.

### 26. `shopProducts` Frontend Registry Deleted (Phase 4b.final)

Status: Active

The frontend content-registry era — which served as the public storefront's source of truth from launch through Phase 8 — is over. `frontend/src/lib/shopAllItems.ts` has been deleted. The non-registry exports that previously co-habited the file have new homes:

- `canonicalShopRoutes` + `ShopBridgeSlug` re-export → `frontend/src/lib/shop-routes.ts`
- `ShopItemType`, `ShopMaterial`, `ShopUseCase`, `ShopSortOption`, `sortOptions`, `ShopTypeFilterOption`, `ShopMaterialFilterOption`, `getShopTypes`, `getShopMaterials`, `matchesShopTypeFilter`, `matchesShopMaterialFilter`, `shopProductReleaseDates`, `getShopProductReleaseDate` → new `frontend/src/lib/shop-taxonomy.ts`. Filter matchers and the release-date lookup now take structural-subset parameters instead of a full product type, so the taxonomy module has no dependency on `ProductView`.
- `notifiableStatuses`, `unbuyableStatuses`, `NotifiableStatus`, `isNotifyMeProduct`, `isUnbuyableProduct`, `getShopProductUseCase` → existing `frontend/src/lib/product-types.ts`. Helpers now take `ProductView` natively (the `as ShopProduct` casts introduced in Phase 4b.iv are gone).

`ShopProduct` is deleted. The 10 component files that typed a prop against it (product cards, sliders, `NotifyMeModal`, `EditorialProductRow`, `ProductDetailDrawer`, `LifestyleSetCard`, `CompactProductCard`, `ShopProductActions`, `ShopAllPageClient`'s local `selectedProduct`, `CategorySection` siblings) now type against `ProductView`. The shape is identical minus the `ritualTag` / `ritualTagHref` fields that were declared a cosmetic drop in Decision #20.

`ProductView` is declared inline in `product-types.ts` instead of `Omit<ShopProduct, "ritualTag" | "ritualTagHref">` — the Omit chain is gone with its source type.

Admin surface removed:

- `frontend/src/components/admin/SyncRegistryButton.tsx`
- The `<SyncRegistryButton />` slot on `/admin/products` (SUPER_ADMIN-gated action row)
- Backend `POST /admin/products/sync-new` handler (~100 lines)
- `syncRegistrySchema` Zod + `syncProductInput` + `normalizeSyncStatus` + `inferCollectionKindsForSyncItem` helpers in `backend/src/routes/admin.ts`

The Sync button existed to bulk-import frontend-registry products into the backend DB during the migration. With the registry gone there is nothing to sync. Future product creation flows through the standard admin UI under `/admin/products/new`. If a future need for bulk JSON import emerges (e.g. a vendor catalog drop), it belongs in a new, narrower endpoint — not this one's ghost.

Dead legacy shop-all filter UI components also deleted (zero importers since the Phase 4b.ii `/shop` rewrite):

- `frontend/src/components/shop-all/FilterPanel.tsx`
- `frontend/src/components/shop-all/CategoryTabs.tsx`
- `frontend/src/components/shop-all/ProductCard.tsx`
- `frontend/src/components/shop-all/SortDropdown.tsx`

(Two files in that directory survived Phase 4b.final — `FeaturedCollectionCallout.tsx` and `ShopHero.tsx`. **Resolved** in a post-migration cleanup PR: both were deleted alongside the retreats/programs DRAFT-filter fix, and the now-empty `frontend/src/components/shop-all/` directory was removed.)

Retained from the registry era:

- `/cart`, `/shop-all`, `/categories/[slug]`, `/lifestyle` compatibility redirects stay per Decision #1. All swapped their `canonicalShopRoutes` import to `shop-routes.ts`.
- The editorial release-date lookup (`shopProductReleaseDates`) was hand-maintained data that never had a backend analogue. It moved to `shop-taxonomy.ts` verbatim. If admins want to control release dates, that's a follow-up (new column on `Product` + admin field + replace the lookup with a prop read).

What's frontend-owned after Phase 4b.final:

- Route-level editorial copy (home sections, `/ritual`, `/our-story`, the Hemanta seasonal-drop editorial, `/programs` page-level marketing decoration)
- Static navigation + routes maps (`shop-routes.ts`, `navigation.ts`)
- Static taxonomy, filter-chip labels, and the release-date lookup (`shop-taxonomy.ts`)
- Display helpers and normalizers (`product-types.ts`, `bridge-page-types.ts`, `retreat-types.ts`, `program-types.ts`, `seijaku-life-types.ts`)
- `/cart` and `/shop-all` redirect stubs

What's backend-owned:

- Every content record that surfaces on the public storefront: products, bridge pages, articles, retreats, programs, program sessions, collections, site settings, media.
- All admin auth, leads (order requests, newsletter, program reservations, retreat inquiries, product notifications), media storage.

The migration arc started in Phase 1 (articles) and closed in Phase 4b.final (products + types + admin sync surface). Every public-facing content surface reads from the backend through `publicBackendJson` with tag-based ISR invalidation (Decision #15). The admin UI is the authoritative editing interface for every content domain. The two-content-layer split that framed this repo's mental model for the first eight phases is now a single backend-authoritative layer with route-level editorial copy layered on top.

### 27. Product Release Dates Are Admin-Editable; Seed Stops Mirroring Deleted Registry

Status: Active

**Release dates.** The `/shop` "Newest" sort previously read from a hand-maintained map in `frontend/src/lib/shop-taxonomy.ts` (`shopProductReleaseDates` / `getShopProductReleaseDate`). That map is deleted. The sort now reads `ProductView.releaseDate` directly — surfaced through the existing `Product.releaseDate` column (present since the initial schema), serialized by `serializeProduct` (already emitting it), and plumbed into `BackendProduct` + `ProductView` + `normalizeBackendProduct` as part of this change. Fallback for products without a set value remains `"2026-01-01"` — identical sort position to pre-change for unmapped slugs.

The admin UI to edit release dates already existed — `ProductEditor.tsx` has a date field wired through the admin Zod schema. This change flipped the read side to match.

Backfill: `backend/prisma/migrations/0005_backfill_product_release_dates/migration.sql` populates `Product.releaseDate` for the 23 slugs that carried values in the old static map. Guarded by `WHERE slug = ... AND "releaseDate" IS NULL` so admin edits are never overwritten. On prod Render runs it automatically via `prisma:deploy`. On local after a fresh DB reset, the seed no longer creates those products (see below), so the UPDATEs are no-ops — harmless.

**Seed simplified.** `backend/prisma/seed.ts` previously imported from the deleted `frontend/src/lib/shopAllItems.ts` (broken since Phase 4b.final) and mirrored the entire frontend registry into the DB on every `prisma:seed`. With the registry gone, the seed's original rationale is gone too. Removed: the product upsert loop, `productOptionsBySlug` fixture, `inferCollections` helper, `normalizeProductStatus` helper, and the bridge-page → product link seeding block. Kept: admin bootstrap, site settings, bridge page categories, collection records (Core / Seasonal / Hemanta), bridge page metadata, articles, retreats, programs, program sessions, the Hemanta seasonal-drop record.

After this change, `npm run prisma:seed` produces a DB with:
- admin bootstrap account
- site settings
- bridge page categories + collections (structural records — so admin-created products can opt in)
- bridge page metadata (hero copy, intro text, etc. — no product links)
- articles, retreats, programs, sessions, seasonal drop metadata
- **zero products**

Local dev onboarding becomes: `prisma:seed` → log into `/admin` → create products via `/admin/products/new` → assign them to bridge pages via `/admin/bridge-pages`. This matches the post-migration mental model (backend is authoritative; admin UI is the editing interface) and makes the content-editor onboarding path the same as the dev onboarding path. If a larger demo dataset becomes useful for dev (e.g. for frontend work that needs populated pages), a small curated fixture set can be added in a separate `seed-data/products.ts` — deliberately smaller than the old 50-product registry, framed as dev fixtures rather than production-parity data.

### 28. Admin-Created Products Auto-Assign To A Default Bridge Page

Status: Active

When an admin saves a new product in `/admin/products/new`, the backend infers a default `ShopBridgePage` from `Product.type` and creates a `ShopBridgePageProduct` link alongside the product row. Admin retains full override via the existing bridge-assignment panel on `/admin/products/[id]`.

Type-to-bridge mapping (both `backend/src/lib/product-bridge.ts` and `frontend/src/lib/shop-taxonomy.ts` — kept in sync by hand):

| `Product.type` | Default bridge slug |
|---|---|
| `Perfume`, `Fragrance Oil` | `perfumes` |
| `Scarf / Square` | `scarves-and-squares` |
| `Diffuser`, `Wax Melt` | `diffusers` |
| `Dokra Ornament` | `dokra-ornaments` |
| `Ritual Box` | `lifestyle` |
| `Program`, `Retreat`, anything unmapped | no auto-link |

Mechanism:

- `POST /admin/products` runs the create, then (if the product saved) looks up the default bridge slug, fetches the bridge page id, computes the next `sortOrder` (`MAX + 1` — new products append to the bottom of the list), and creates the `ShopBridgePageProduct` link. Re-fetches the product with `productInclude` so the 201 response reflects the new link.
- If the bridge page doesn't exist (e.g. `lifestyle` bridge was deleted), the link step silently skips — product still saves.
- If the link creation throws for any other reason, it's logged with `console.warn` and swallowed. The product save is the primary contract; a failed auto-link degrades to "admin manually assigns via bridge-pages panel," matching pre-PR behaviour.
- **No re-sync on update.** Editing a product's `type` does NOT move it between bridges. Changing a Perfume to a Diffuser keeps the `perfumes` bridge link and does not add a `diffusers` link. Admins reconcile manually. This is intentional — auto-moving on every type edit would be destructive in the opposite direction and surprise admins who renamed a product after-the-fact.
- **No backfill of existing orphans.** Products created before this PR with no bridge assignment stay orphan. If that becomes worth fixing, spin a separate opt-in migration.
- Admin form surfaces a one-line notice near the Type input on new-product flow ("On save this will auto-assign to /shop/perfumes…"), so the auto-assignment isn't hidden magic.

Risk of the two-mapping-file setup: the backend mapping (authoritative for the actual link creation) and the frontend mapping (only used for the pre-save notice copy) must stay in sync. Both sites carry cross-reference comments. If a third surface needs the rule, consolidate into a single shared module.

### 29. Homepage "How Seijaku Works" Section Is Admin-Curated Monthly

Status: Active

The homepage "How Seijaku Works" section (3 perfumes + 3 artifacts + a ritual video link) is admin-curated via a new `/admin/stories` CMS surface. The static `frontend/src/components/howSeijakuWorks.options.ts` module is deleted.

Schema:

- New `Story` model with six product foreign keys (slot-based: `perfume1Id`/`perfume2Id`/`perfume3Id` / `artifact1Id`/`artifact2Id`/`artifact3Id`), `launchDate`, `videoUrl`, `status: ACTIVE | INACTIVE`, timestamps.
- All six FKs use `onDelete: Restrict` — products referenced by a story cannot be deleted until the reference is removed. Strict but safe; prevents silent broken-story state.
- Index on `(status, launchDate)` for the public-read query.
- Migration `0006_add_story_model` is hand-written SQL per the local-prisma-migrate-dev block; Render auto-applies on deploy.

Public read path:

- `GET /content/story/current` returns the latest `status=ACTIVE` story whose `launchDate <= NOW()`. Returns 404 if none — frontend hides the homepage section in that case.
- Frontend lazy-fetches via `/api/public/content/story/current` on mount inside `HowSeijakuWorks.tsx` (mirroring the `RitualSetsSection` pattern from Phase 4b.iii — the home page is a `"use client"` tree, no server-parent restructuring needed).
- Tagged `[stories, products]` via `publicBackendJson` so admin product writes (title / image changes) also invalidate stories that reference those products.

Admin write path:

- `GET /admin/stories` (list summary), `GET /admin/stories/:id` (full detail with included products), `POST /admin/stories` (create), `PATCH /admin/stories/:id` (partial update), `DELETE /admin/stories/:id` (SUPER_ADMIN only).
- Cross-slot validation: perfume slots must reference products in the `/shop/perfumes` bridge; artifact slots cannot be in `/shop/perfumes`. Distinct IDs enforced per side. Bridge membership verified server-side at create + update time (any slot change re-validates).
- Cache tag wiring: `tagsForAdminWrite("stories")` returns `[stories]`. Product writes also invalidate `stories` (mapping in `cache-tags.ts`). Media writes invalidate `stories` so an admin replacing a primary image refreshes the homepage.

Step background images:

- Derived deterministically from the 6 product images on the story. Step 1 picks from the 3 perfume images; step 2 from the 3 artifact images; step 3 from any of the 6. `pickBackground(seedKey, candidates, fallback)` uses a small djb2-style hash of `${story.id}:${slotIndex}` modulo the candidate count — same story always renders the same backgrounds, new story rotates them. Avoids hydration mismatch and per-refresh jitter.
- If no image is available (e.g. one of the 3 products has no `primaryImage`), falls back to the first valid image in the candidate list, or to a hardcoded placeholder.

Admin form (StoryEditor):

- Two columns of three single-select dropdowns (perfumes left, artifacts right). Options partitioned client-side from a single `/admin/products?workflow=published` fetch.
- Datetime-local input for launch date (admin can schedule precisely; future-dated stories stay hidden until their launch date passes).
- URL input for video (any URL — YouTube, Vimeo, etc. — admins paste; not enforced by validator beyond being a valid URL).
- Active/Inactive radio toggle.
- Client-side validation (all 6 slots populated, distinct per side, valid URL) plus server-side validation (bridge membership, distinctness re-checked, ID existence).
- Status pill on the index table distinguishes "Live" (ACTIVE + launch date passed), "Scheduled" (ACTIVE + future launch), "Inactive".

Trade-offs:

- **No fallback to a static default when no story exists** — section hides entirely. Per scope decision Q6, brand-new install or fully deactivated state means the section is invisible. Forces admins to create at least one story for the section to appear.
- **No bulk product reassignment.** If a product is renamed or its image changes, the story re-renders with new content (good — content tracking is the whole point). If a product is deleted, the FK Restrict prevents that until admin updates the story (good — explicit failure rather than silent half-state).
- **Two-mapping risk avoided.** The bridge-page filter rule (perfumes vs not-perfumes) lives only in the backend validator; the frontend filter in `StoryEditor` reads the same `bridgePages.slug` field. No duplicated mapping.
- **Foreign key on products.** `Product.deleted` now harder for admins — they must remove the story reference first. This is a deliberate UX trade-off vs `SetNull` + filter-at-display, which would silently break stories.
- **Single video per story.** No per-pair video matrix (per scope decision Q1). The ritual demo is a single curated piece per month, regardless of which (perfume, artifact) combination the visitor selects.

Onboarding note: a fresh local seed (post-Decision-#27) creates no products. Workflow to see the homepage section locally: log into `/admin` → `/admin/products/new` → create at least 3 perfumes (auto-routed to /shop/perfumes via Decision #28) and 3 non-perfume products → `/admin/stories/new` → fill the 6 slots + launch date in the past + video URL + ACTIVE → save. Visit `/`.

## How To Use This File

- Add a new entry when a structural or cross-cutting product decision is made.
- Update an existing entry when the system deliberately changes ownership or architecture.
- Do not treat accidental drift as an approved decision.
