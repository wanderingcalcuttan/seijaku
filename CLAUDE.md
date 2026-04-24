# CLAUDE.md

Guidance for Claude Code working in this repo. Keep this file terse and current — if a rule here stops being true, update it.

## What This Repo Is

Seijaku is a two-workspace monorepo:

- `frontend/` — Next.js 16 App Router (React 19, TypeScript, Tailwind 4, Framer Motion). Renders public storefront AND hosts admin CMS under `/admin/*`. Also contains a BFF layer under `/api/admin/*` and `/api/public/*` that proxies to the backend.
- `backend/` — standalone Express + Prisma + PostgreSQL service (system of record for admin auth, normalized content, media, and lead persistence).

Repo-root scripts coordinate both workspaces via npm workspaces.

## Core Mental Model (read this before editing content)

The migration is **intentionally incomplete**. There are two live content layers:

1. **Frontend registries** in `frontend/src/lib/*.ts` (`shopAllItems.ts`, `navigation.ts`) — drive most of what public visitors see today. Articles, Retreats, Programs, Shop Bridge Pages (metadata + the `/shop/[slug]` product lists) are already migrated to backend-fed reads via `publicBackendJson`; see Decisions #16–#20. Remaining `shopProducts` consumers (home featured sets, shop-all grid, search overlay, cart, checkout, Lifestyle Gift Pouch option lists) still read the registry until Phase 4b.ii+.
2. **Backend Prisma records** — drive admin CRUD, media, and lead flows.

Backend admin edits do **not** automatically update most public pages yet. If a change must appear on the public site *today*, edit the frontend registry. If it's admin/API/database work, edit the backend. If you're migrating a domain from one to the other, update both plus the docs in the same change.

See `CONTENT_MODEL.md` for the full source-of-truth breakdown and `ARCHITECTURE.md` for the system-level picture. Always consult these before changing route ownership or content ownership.

## Commands

All commands from repo root unless stated.

```bash
# dev
npm run dev:frontend                 # Next dev on :3000 (or :3001 if 3000 is taken)
npm run dev:backend                  # Express+tsx watch on :4001

# build / validate
npm run build                        # frontend-only — used by Vercel prod build
npm run build:all                    # frontend + backend (use this for local validation)
cd frontend && npx tsc --noEmit      # frontend typecheck
cd frontend && npm run lint          # eslint

# backend DB workflow
cd backend
npm run prisma:generate              # regenerate client (also runs on postinstall)
npm run prisma:migrate -- --name X   # dev migration
npm run prisma:deploy                # prod migration (run manually against prod DB after schema changes)
npm run prisma:seed                  # seed bootstrap admin + content

# health checks
curl -sS http://localhost:4001/health                    # backend
curl -sS -o /dev/null -w "%{http_code}\n" localhost:3000  # frontend
```

## Local Admin Credentials

Bootstrap admin from `backend/.env` (after `prisma:seed` runs):

- email: `admin@seijaku.local`
- password: `password123`

Login: http://localhost:3000/admin/login (or :3001).

## Canonical Files To Read Before Touching Anything Load-Bearing

- Routing / shell: `frontend/src/app/layout.tsx`, `frontend/src/components/AppShell.tsx`
- Admin session boundary: `frontend/src/lib/admin-session.ts`, `frontend/src/lib/admin-backend.ts`, `frontend/src/lib/backend.ts`
- BFF proxy: `frontend/src/app/api/admin/session/route.ts`, `frontend/src/app/api/admin/proxy/[...path]/route.ts`, `frontend/src/app/api/public/[...path]/route.ts`
- Public storefront truth: `frontend/src/lib/shopAllItems.ts`, `frontend/src/lib/navigation.ts`
- Backend entrypoint: `backend/src/app.ts`, `backend/src/routes/admin.ts`, `backend/src/routes/public.ts`
- Schema: `backend/prisma/schema.prisma`

## Conventions & Rules

- **Do not add logic to both the frontend registry AND the backend record for the same domain.** Pick one source and, if migrating, ensure the other becomes inert (not silently duplicated).
- **`frontend/src/lib/categoryBridge.ts` is legacy.** Do not extend it. Do not add new references to it. Compatibility routes `/shop-all`, `/lifestyle`, `/categories/[slug]` are kept alive but not canonical — new shop work goes under `/shop/*`.
- **Browser JS must never hold raw backend bearer tokens.** All admin writes go through `/api/admin/proxy/*`; all public lead writes go through `/api/public/*`. The JWT lives only in a signed httpOnly cookie handled by `frontend/src/lib/admin-session.ts`.
- **Admin route tree** uses Next route groups: `frontend/src/app/admin/(auth)/login` and `frontend/src/app/admin/(protected)/*`. The `(protected)` layout enforces session; call `requireCurrentAdmin()` in server components instead of hand-rolling cookie checks.
- **Backend is ESM + NodeNext.** All local imports in `backend/src/**` use `.js` extensions (TypeScript requires this with `"module": "NodeNext"`). Match this pattern when adding files.
- **Backend validation via Zod.** New request schemas go next to the route that uses them, not in a shared schema file.
- **Prisma client generation is part of the backend build.** `npm run build` in `backend/` runs `prisma generate` first; don't skip that step if you add a deploy script.
- **Self-hosted fonts** live in `frontend/src/app/fonts/*.woff2`. Don't reintroduce `next/font/google`.
- **`NEXT_IGNORE_INCORRECT_LOCKFILE=1`** is set in `frontend` dev and build scripts deliberately to avoid Next's lockfile patcher breaking the workspace layout. Don't remove it.
- **Caching contract (Decision #15).** Public server reads go through `publicBackendJson(path, { revalidate, tags })` in `frontend/src/lib/backend.ts` — always pass explicit `tags: CacheTag[]`. Admin reads go through `adminBackendJson(...)` which pins `no-store`. Admin writes through `/api/admin/proxy/*` auto-invalidate tags via `tagsForAdminWrite(upstreamPath)` in `frontend/src/lib/cache-tags.ts` — add new admin resources to that map in the same change.

## When Making Changes

1. **UI changes:** start the dev server and verify in a browser — typecheck is not a substitute for actually clicking through the feature. If you can't, say so explicitly.
2. **Schema changes:** write the migration with `prisma:migrate`, regenerate the client, update any affected serializers in `backend/src/utils/serializers.ts`, and update Zod schemas in the relevant route file.
3. **Backend API signature changes:** the BFF proxy is a passthrough, so changing `/admin/*` response shape will break admin pages and client editors that call `/api/admin/proxy/*`. Search both sides.
4. **Content model moves** (frontend registry → backend, or backend → frontend): update `CONTENT_MODEL.md` and `DECISIONS.md` in the same change. This is non-negotiable per Decision #9.
5. **Dependency bumps:** run `npm install` at the repo root (not inside a workspace) so the workspace lockfile stays consistent.

## Git & Deployment

- Remote: `github.com/wanderingcalcuttan/seijaku`. Production branch is **`main`** for both Vercel projects.
- Workflow: feature branch → PR → merge to `main` → Vercel auto-deploys both projects (`seijaku` frontend and `seijaku-backend`).
- No GitHub Actions. All CI is Vercel Git integration.
- Vercel monorepo filter: commits touching only `frontend/` skip the backend build (and vice versa). Root-file commits rebuild both.
- Local `gh` wrapper: `./.git-tools/gh-local` uses the repo-specific GitHub account (`wanderingcalcuttan`). Use it, not global `gh`, for repo ops.
- **Backend is on Render Free (not Vercel).** Express app at `https://seijaku-backend.onrender.com`. Render auto-deploys on push to `main` — build command is `npm install && npm run build && npm run prisma:deploy`, so Prisma migrations apply automatically before the new process starts. Free tier sleeps after 15 min of inactivity; first request after idle waits 30-50s for wake-up. Upgrade to Render's always-on tier ($7/mo) to eliminate the wake-up delay when real traffic starts.
- **Frontend is on Vercel** at `https://www.seijaku.co` (custom) and `https://seijaku-kappa.vercel.app` (alias). Auto-deploys on push to `main`. Frontend's `BACKEND_INTERNAL_URL` env var points at the Render backend.
- **Preview env var gap:** `BACKEND_INTERNAL_URL`, `ADMIN_COOKIE_SECRET` are Production-only on Vercel frontend. Preview admin flows will be broken until Preview-scope values are added.
- **Object storage is Supabase Storage** via the S3 driver. Bucket `seijaku-media-prod` in us-east-1. Public-read; uploads authenticated with S3 credentials bypassing Supabase RLS. Uploaded URL pattern: `https://<project-ref>.supabase.co/storage/v1/object/public/seijaku-media-prod/<filename>`. AWS SDK is lazy-loaded to reduce cold start. Driver is provider-agnostic; swap to R2/B2/AWS later is just env vars.
- **CORS is locked on Render prod.** `CORS_ORIGIN=https://seijaku-kappa.vercel.app`. Add `https://www.seijaku.co` to the comma-separated list when convenient. Note: the browser never calls the backend directly (all traffic through the Next BFF, server-to-server), so CORS is defense-in-depth here, not a functional requirement.
- **Vercel Blob was rejected.** PRs #7 and #8 both hung serverless functions on cold start. Root cause unconfirmed (likely Vercel integration auto-wiring + Express conflict). Reverted in PR #9. Documented in `DECISIONS.md#12`.

## Things Not To Do

- Don't commit `.env` files. Both `backend/.env` and any frontend secret env are git-ignored — keep them that way.
- Don't push directly to `main`. Use a feature branch + PR so Vercel produces a preview first.
- Don't edit bundled images in `frontend/public/images` assuming admin media library will reflect the change — the two systems are not yet linked for public pages.
- Don't introduce a new top-level content registry in `frontend/src/lib`. New content should go through the backend; new frontend-only copy belongs in a route-level file.
- Don't run `git add -A` or `git add .` — stage by path to avoid sweeping in `.env`, `node_modules`, or build artifacts.

## Documentation Hierarchy

Read in this order for a new task:

1. `CLAUDE.md` (this file) — operational rules
2. `ARCHITECTURE.md` — system shape
3. `CONTENT_MODEL.md` — where each piece of content actually lives
4. `DECISIONS.md` — what's deliberately this way
5. `WORKFLOWS.md` — setup/validation recipes
6. `frontend/CLAUDE.md` / `backend/CLAUDE.md` — workspace-specific nuances
7. `README.md` — outward-facing summary
