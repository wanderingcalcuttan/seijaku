# Seijaku Architecture

## Overview

Seijaku is no longer just a frontend prototype. The repo now contains a split architecture:

1. a Next.js frontend workspace for public pages and the embedded admin UI
2. a Next-side BFF layer for admin session handling and backend proxying
3. a standalone Express + Prisma backend as the system of record
4. a PostgreSQL database seeded from the current content set

The important nuance is that the migration is incomplete. Public rendering is still mostly frontend-driven, while admin and lead workflows are backend-driven.

## High-Level System

### Frontend App

Primary responsibilities:

- marketing and editorial pages
- shop browsing and detail pages
- ritual and collection UI
- checkout/order-request UI
- admin CMS under `/admin`

Key folders:

- `frontend/src/app`
- `frontend/src/components`
- `frontend/src/lib`
- `frontend/public/images`

### Next BFF Layer

The browser does not talk directly to the backend for admin work.

Key entrypoints:

- `frontend/src/app/api/admin/session/route.ts`
- `frontend/src/app/api/admin/proxy/[...path]/route.ts`
- `frontend/src/app/api/public/[...path]/route.ts`

Responsibilities:

- login/logout/session lookup
- storing the backend JWT inside a signed httpOnly cookie
- proxying admin API calls so browser code never handles raw bearer tokens
- proxying public lead submissions to the backend

### Backend Service

The backend lives in `backend/` and owns:

- admin authentication
- normalized catalog/content models
- media records and upload handling
- lead capture and lead workflow state
- admin dashboard aggregates

Key files:

- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`
- `backend/src/routes/public.ts`
- `backend/src/routes/admin.ts`

### Database

PostgreSQL is the primary data store.

The backend schema includes:

- admins
- customers
- media assets
- products, categories, collections, bridge pages, options
- articles, retreats, programs, sessions, site settings
- order requests, newsletter subscriptions, program reservations, retreat inquiries
- schema-ready wishlist and ritual tables for later phases

## Top-Level Structure

- `backend`
  - API server, Prisma schema, migrations, seed logic
- `frontend`
  - Next.js app workspace, frontend config, env example, assets, and scripts
- `frontend/src/app`
  - public routes, admin route groups, and Next API routes
- `frontend/src/app/admin`
  - admin route tree and server-rendered admin pages
- `frontend/src/app/api`
  - BFF endpoints for admin session and backend proxies
- `frontend/src/components/admin`
  - admin shell, editors, inboxes, and shared admin UI
- `frontend/src/lib`
  - public content registries plus admin/backend/session helpers
- `frontend/public/images`
  - public bundled assets used by the live storefront

## Route Model

### Public Route Families

- `(marketing)` homepage
- `/shop` and `/shop/[slug]`
- `/our-story`
- `/seasonaldrops`
- `/a-seijaku-life`
- `/retreats` and `/retreats/[slug]`
- `/programs` and the program detail routes
- `/experiences`
- `/ritual`
- `/dashboard`
- `/collection`
- `/checkout`

### Admin Route Family

Admin lives inside the Next app under `/admin`, with its own route-group layout and shell.

Important routes:

- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/products/[id]`
- `/admin/bridge-pages`
- `/admin/articles`
- `/admin/retreats`
- `/admin/programs`
- `/admin/program-sessions`
- `/admin/collections`
- `/admin/categories`
- `/admin/media`
- `/admin/leads`
- `/admin/settings`
- `/admin/team`

### Compatibility Routes

These still exist, but they are not canonical:

- `/shop-all`
- `/lifestyle`
- `/categories/[slug]`

## App Shell

The root layout is still defined in `frontend/src/app/layout.tsx`, but the app now uses `frontend/src/components/AppShell.tsx` to avoid rendering the public marketing chrome inside `/admin`.

Current behavior:

- public routes receive the global navbar, footer, shop state, and route-transition behavior
- admin routes render inside a dedicated admin shell

This is a meaningful improvement over the earlier all-routes-share-the-marketing-shell model, but the root still wraps some shared providers globally.

## Data Flow

### Public Reads

Most public page reads still come from frontend files in `frontend/src/lib` and route-level components.

Current examples:

- shop/catalog structure from `frontend/src/lib/shopAllItems.ts`
- navigation from `frontend/src/lib/navigation.ts`

Already migrated to backend-fed reads:

- editorial (`/a-seijaku-life` + detail pages) — reads via `publicBackendJson("/content/articles", { tags: ["articles"] })`; see Decision #16.
- retreats (`/experiences` gallery + `/retreats/[slug]`) — reads via `publicBackendJson("/content/retreats", { tags: ["retreats"] })`; see Decision #17.

When a domain migrates to backend-fed reads, the server component fetches via `publicBackendJson(path, { revalidate, tags })`. Results land in Next's Data Cache with a 60-second default `revalidate`, and admin writes invalidate by tag on demand through `/api/revalidate`. Admin reads explicitly pin `no-store`. See `DECISIONS.md` #15 and `CONTENT_MODEL.md` (Cache Tags) for the contract.

### Public Writes

Public write flows now go through the backend via the Next proxy layer:

- footer newsletter signup
- checkout order requests
- program reservations
- retreat inquiries

Browser path:

1. public component submits to `/api/public/*`
2. Next route handler proxies to backend
3. backend validates and persists the lead

### Admin Reads And Writes

Admin pages are server-rendered in Next, but all durable data comes from the backend.

Flow:

1. admin logs in through `/api/admin/session`
2. Next stores a signed httpOnly session cookie
3. admin pages call backend-facing helpers on the server
4. client editors submit to `/api/admin/proxy/*`
5. Next forwards requests to backend `/admin/*` endpoints with bearer auth

## Admin Authentication

Session model:

- backend issues JWT on `POST /admin/auth/login`
- Next stores that JWT in a signed httpOnly cookie
- browser JavaScript never stores the raw admin token
- protected admin routes redirect to `/admin/login` when the cookie is missing or invalid

Roles:

- `SUPER_ADMIN`
- `EDITOR`

`SUPER_ADMIN` is intended to manage admins, settings, and destructive/publish-level actions. `EDITOR` handles day-to-day content, media, and leads.

## Commerce Architecture

There are currently two parallel commerce representations:

### Public storefront representation

Canonical today for storefront rendering:

- `frontend/src/lib/shopAllItems.ts`

This still drives:

- shop routes
- product cards and detail behavior
- filtering and sorting
- route-level metadata

### Backend normalized representation

Canonical for admin/API/database work:

- `backend/prisma/schema.prisma`
- seeded records imported by `backend/prisma/seed.ts`

This powers:

- admin product CRUD
- categories, collections, bridge pages
- product options and option values
- order-request item snapshots

### Main Architectural Risk

These two representations can drift.

Right now:

- public shop pages mostly trust `frontend/src/lib/shopAllItems.ts`
- admin edits update backend product records

Until storefront reads are migrated to backend APIs, backend catalog edits should be treated as admin/data groundwork rather than a complete public CMS.

## Repo Layout Decision

The repo now uses an npm workspace layout:

- `frontend/`
- `backend/`
- docs and workspace tooling at the repo root

This separation is deliberate. It keeps frontend builds from typechecking backend code, makes root-directory configuration explicit on both Vercel (frontend) and Render (backend), and allows each to build independently.

## Deployment Topology

- Frontend → Vercel (`seijaku` project, Root Directory `frontend/`). Auto-deploys on push to `main`. Custom domain `www.seijaku.co` + `.vercel.app` alias.
- Backend → Render Free (`seijaku-backend` service, Root Directory `backend/`). Auto-deploys on push to `main`. Build command includes `prisma migrate deploy` so migrations land with every deploy. Free tier sleeps after 15 min idle; first request after idle waits 30-50s.
- Database → Neon Postgres (shared across env scopes today; no per-branch DB yet).
- Object storage → Supabase Storage (S3-compatible), bucket `seijaku-media-prod`. Accessed via the existing S3 driver in `backend/src/lib/storage.ts`; swapping to R2/B2/AWS is env-var-only.

The backend used to be a Vercel serverless function. That didn't work reliably for this Express app — see `DECISIONS.md#13` for why we moved.

## Content Architecture

The content model is now split:

- frontend-owned presentation content for the currently rendered storefront
- backend-owned normalized content for admin and future API-fed pages

See `CONTENT_MODEL.md` for the operational source-of-truth breakdown.

## Media Architecture

Two media systems currently coexist:

- bundled public assets in `frontend/public/images`
- backend `MediaAsset` records, with local upload storage in development and S3-compatible support in production

The bundled assets are still what most public pages render today. The backend media library is used by admin-managed records and future migration work.

## Legacy / Transitional Areas

`frontend/src/lib/categoryBridge.ts` remains the clearest legacy module. It reflects the older `/categories/*`, `/shop-all`, and `/lifestyle` model rather than the canonical `/shop/*` structure.

Going forward:

- treat `frontend/src/lib/shopAllItems.ts` as the storefront source of truth
- treat `categoryBridge.ts` as legacy
- do not add new logic to both systems

## Current Maturity Assessment

Strongest areas:

- admin authentication boundary
- backend schema breadth
- seeded data model
- public lead capture
- route-level separation between public and admin UI

Weakest areas:

- storefront still not reading from backend content
- duplicated source of truth between frontend registries and backend records
- incomplete end-to-end CMS effect for public pages
- mixed public/backend content ownership during the migration

## Recommended Source-Of-Truth Files

When working in this repo, start with:

- `frontend/src/app/layout.tsx`
- `frontend/src/components/AppShell.tsx`
- `frontend/src/lib/shopAllItems.ts`
- `frontend/src/lib/navigation.ts`
- `frontend/src/lib/admin-session.ts`
- `frontend/src/app/api/admin/session/route.ts`
- `frontend/src/app/api/admin/proxy/[...path]/route.ts`
- `frontend/src/app/api/public/[...path]/route.ts`
- `backend/prisma/schema.prisma`
- `backend/src/routes/public.ts`
- `backend/src/routes/admin.ts`

## Near-Term Architecture Gaps

The main follow-up work should be:

- migrate public catalog/content reads from `frontend/src/lib` to backend APIs
- consolidate the storefront and backend content sources
- decide whether public assets remain bundled or move behind the media library
- tighten bootstrap-admin handling beyond env-seeded defaults
