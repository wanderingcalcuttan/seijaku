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

### 10. Production Prisma Migrations Run In The Vercel Build Hook

Status: Active

`backend/scripts/vercel-build.sh` runs `prisma migrate deploy` when `VERCEL_ENV=production`, using the unpooled Neon URL (`DATABASE_URL_UNPOOLED` or `POSTGRES_URL_NON_POOLING`). Preview and local builds never touch a remote database.

A failed migration fails the Vercel build. The previous function keeps serving until the build passes. Destructive or long-locking migrations should still be audited manually before merge.

Rationale: remove the per-deploy human step that was previously required, which was a known source of 500s after a schema change merged without the operator remembering to run `prisma migrate deploy`.

### 11. Production Backend CORS Is Locked To The Canonical Frontend Alias

Status: Active

`CORS_ORIGIN` on the `seijaku-backend` Production scope is pinned to `https://seijaku-kappa.vercel.app`. Preview and Development scopes remain open.

The browser never calls the backend directly in normal flows — all traffic goes through the Next BFF on the frontend domain as server-to-server fetches, which are not subject to CORS. Locking prod CORS closes the direct-from-browser path while not affecting any real request path.

When a custom frontend domain is added, extend `CORS_ORIGIN` to the comma-separated list containing both the custom domain and the `seijaku-kappa` alias until the alias is retired.

### 12. Object Storage Decision Deferred; Vercel Blob Rejected

Status: Active

Vercel Blob was attempted as the production media store in PR #7 and PR #8. Both resulted in prod backend deployments that hung on cold start — build logs clean, runtime never responded, no error surfaced. Suspected root cause: conflict between the Vercel Blob integration auto-wiring and the `@vercel/node` serverless pipeline running our Express app. Not confirmed; not worth further investigation right now.

Both PRs were rolled back via `vercel promote`. PR #9 removed the `@vercel/blob` dependency, the `"vercel-blob"` driver branch, and disconnected the Blob store.

Current state: `STORAGE_DRIVER` unset in prod (defaults to `local`, which is ephemeral on serverless and therefore known-broken for real uploads). The S3 driver in `backend/src/lib/storage.ts` is intact and ready for any S3-compatible provider.

Next action: provision Cloudflare R2 and wire up via the existing S3 driver. Revisit Vercel Blob only if we later consolidate the backend onto Vercel Functions in a way that avoids the current hang, or once Vercel's Blob integration supports the legacy `@vercel/node` Express pattern.

## How To Use This File

- Add a new entry when a structural or cross-cutting product decision is made.
- Update an existing entry when the system deliberately changes ownership or architecture.
- Do not treat accidental drift as an approved decision.
