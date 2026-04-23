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

## How To Use This File

- Add a new entry when a structural or cross-cutting product decision is made.
- Update an existing entry when the system deliberately changes ownership or architecture.
- Do not treat accidental drift as an approved decision.
