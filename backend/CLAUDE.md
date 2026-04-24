# CLAUDE.md — backend workspace

Complements the repo-root `CLAUDE.md`. Read that first.

## Stack

Express 4, Prisma 6, PostgreSQL (Neon in prod), Zod, JWT, bcryptjs, multer, morgan. TypeScript ESM with `"module": "NodeNext"`. Runs via `tsx watch` in dev, compiled to `dist/` via `tsc`, served as a long-running Node process on Render in production.

## Key Paths

- `src/server.ts` — entry; starts Express on `PORT` (default 4001; Render injects one automatically in prod)
- `src/app.ts` — middleware chain (cors → json → morgan → optional `/uploads` static → `/health` → public router → `/admin` router → error middleware)
- `src/config.ts` — Zod-validated env loader; fail-fast on missing `DATABASE_URL` or short `JWT_SECRET`
- `src/routes/public.ts` — unauthenticated catalog/content reads + lead writes
- `src/routes/admin.ts` — JWT-guarded admin CRUD; 1400+ lines; organized by resource
- `src/middleware/requireAdmin.ts` — verifies JWT, attaches admin to `req`, exports `requireAdmin` and `requireAdminRole`
- `src/lib/auth.ts` — `signAdminToken`, `verifyPassword`, `hashPassword` (bcrypt)
- `src/lib/prisma.ts` — shared Prisma client (singleton)
- `src/lib/storage.ts` — upload handling, local/S3 driver switch with lazy-loaded AWS SDK
- `src/utils/http.ts` — `asyncHandler`, `HttpError`, `parseBody`, error middleware
- `src/utils/serializers.ts` — Prisma record → API payload shape (keep admin and public shapes in sync)
- `prisma/schema.prisma` — enums + models
- `prisma/migrations/0001_init/` — initial SQL
- `prisma/seed.ts` — imports current frontend content into the DB so admin starts with realistic data

## ESM Rules (important)

- `tsconfig.json` uses `"module": "NodeNext"`. All **local** imports MUST use the `.js` extension even though the source is `.ts`:
  ```ts
  import { prisma } from "../lib/prisma.js";  // ✓
  import { prisma } from "../lib/prisma";     // ✗ fails at runtime
  ```
- `package.json` has `"type": "module"`. No CommonJS `require()`.
- Prisma is excluded from the TS build (`prisma/**/*.ts` in `tsconfig.exclude`); `seed.ts` runs through `tsx`, not `tsc`.
- `tsconfig.json` has `rootDir: "src"`, `outDir: "dist"`. Compiled entry lands at `dist/server.js` (matching `"start": "node dist/server.js"`).

## Auth Flow

1. `POST /admin/auth/login` validates email/password, returns `{ token, admin }`.
2. Tokens are 7-day JWTs signed with `JWT_SECRET`. The Next BFF wraps them in a signed httpOnly cookie — backend never sees the cookie.
3. `requireAdmin` decodes the bearer token and loads the admin. `requireAdminRole("SUPER_ADMIN")` additionally enforces role.
4. `GET /admin/auth/me` returns the current admin — used by the Next session route to populate the admin identity.

## Routes At A Glance

Public:
- `GET  /health`
- `GET  /catalog/products`, `/catalog/products/:slug`, `/catalog/bridge-pages/:slug`
- `GET  /content/articles`, `/content/articles/:slug`, `/content/retreats`, `/content/retreats/:slug`, `/content/programs`, `/content/programs/:slug`, `/content/site-settings`
- `POST /lead/order-requests`, `/lead/newsletter-subscriptions`, `/lead/program-reservations`, `/lead/retreat-inquiries`, `/lead/product-notifications`

Admin (all under `/admin`, all JWT-guarded):
- `auth/login`, `auth/me`
- `admins/*` (SUPER_ADMIN only)
- `media/*`, `categories/*`, `products/*`, `product-options/*`
- `POST /admin/products/sync-new` (SUPER_ADMIN only) — one-shot sync of products from the frontend registry. Client posts the `shopProducts` payload; server creates only slugs not already in the DB inside a single `$transaction`; hand-edited records are never touched. Bounded by Zod `.max(200)`. No retries, no polling. See `SyncRegistryButton.tsx` for the admin UI trigger.
- `bridge-pages/*`, `articles/*`, `retreats/*`, `programs/*`, `program-sessions/*`, `collections/*`
- `site-settings`
- `leads/*` (order requests, newsletter subs, program reservations, retreat inquiries, product notifications)

## Commands

```bash
# dev
npm run dev                               # tsx watch on :4001

# prisma
npm run prisma:generate                   # regen client
npm run prisma:migrate -- --name <name>   # new migration
npm run prisma:deploy                     # apply pending migrations (also runs in Render build)
npm run prisma:seed                       # run prisma/seed.ts

# build
npm run build                             # prisma generate + tsc → dist/
npm run start                             # node dist/server.js (what Render invokes)
```

## Render Deployment

- Service: `seijaku-backend` on Render Free tier
- Region: closest to Neon US-East
- Root Directory: `backend/`
- **Build Command**: `npm install && npm run build && npm run prisma:deploy`
  - Runs prisma generate, compiles TypeScript, applies pending migrations against prod Neon DB. A failed migration fails the deploy; the previous process keeps serving.
- **Start Command**: `npm start`
- **Auto-deploys on push to `main`**.
- **Free tier caveat**: sleeps after 15 min of inactivity; first request after idle waits 30-50s for wake-up. Public image reads go directly to Supabase (CDN) so they're unaffected; only backend-routed requests (admin, lead submissions, backend-fed content reads) feel the wake-up.

## Env Vars

Required: `DATABASE_URL`, `JWT_SECRET` (min 8 chars).

Common: `PORT` (auto-provided by Render), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ORIGIN` (comma-separated), `PUBLIC_BASE_URL`.

Storage: `STORAGE_DRIVER` (`local` | `s3`), `LOCAL_UPLOAD_DIR`.
- When `s3` (current prod): `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_FORCE_PATH_STYLE`, `S3_PUBLIC_URL_BASE`.

Migrations: the Render build command uses `DATABASE_URL` for `prisma migrate deploy`. If pooled vs direct connection ever matters (e.g., a migration that needs a direct connection against PgBouncer-pooled Neon URLs), add `DATABASE_URL_UNPOOLED` and update the build command to use it explicitly.

Current prod wiring: `STORAGE_DRIVER=s3` pointing at Supabase; `CORS_ORIGIN=https://seijaku-kappa.vercel.app`.

Notify Me admin ping (all optional; feature opt-in): `ADMIN_NOTIFICATION_EMAIL`, `NOTIFIER_FROM_EMAIL`, `RESEND_API_KEY`. While unset, `src/lib/notifier.ts` silently skips dispatch and the `ProductNotification` row still surfaces in `/admin/leads`. See `DECISIONS.md#14` for the rationale on keeping the dispatcher stubbed.

## Patterns To Follow

- New route file → mount it in `src/app.ts`. Zod schemas live next to the route.
- New Prisma model → add to `schema.prisma`, run `prisma migrate dev`, add a serializer in `utils/serializers.ts`, update the relevant route.
- Throw `new HttpError(status, message)` for expected failures. The error middleware formats them. Don't `res.status(...).json(...)` your own errors — keep the shape consistent.
- Wrap async handlers with `asyncHandler()` so rejections hit the error middleware instead of hanging.
- Use `parseBody(schema, req)` for Zod-validated request bodies; it throws a 400 on validation error.
- Heavy dependencies (like `@aws-sdk/client-s3`) should be lazy-loaded inside the function that uses them, not imported at module top level, to keep startup fast.

## Common Gotchas

- `multer` runs in `memoryStorage()` with a 50 MB limit (bumped from 10 MB to accommodate short product-marketing video clips). If you need bigger uploads, adjust in `routes/admin.ts` and keep `AddMediaDialog`'s helper copy + the `LIMIT_FILE_SIZE` message in `utils/http.ts` in sync.
- CORS defaults to reflect any origin when `CORS_ORIGIN` is unset — lock this down in prod by setting the env var.
- Prisma client is excluded from the TS source tree but is required at runtime. `postinstall` generates it — don't remove that script.
- The seed is destructive-ish (upserts bootstrap admin, (re)creates structural records + editorial content like articles / retreats / programs / bridge-page metadata). It does NOT seed products — since Phase 4b.final (Decision #26) + Decision #27, products are created via the admin UI after seeding. Don't run against a populated prod DB without reading `prisma/seed.ts` first.
- Render Free sleeps on idle. If you care about first-request latency for real users, upgrade the Render instance OR add a keep-warm cron.
