# Seijaku

Seijaku is a split frontend and backend application for a content-led commerce, editorial, and experience brand.

Today the repo contains:

- a Next.js App Router frontend for marketing, shop, ritual, checkout, experiences, and admin UI
- a standalone Express + Prisma + PostgreSQL backend for admin auth, normalized content records, media, and inbound leads
- a workspace root that coordinates both apps
- repo docs that describe the current architecture and where the source of truth lives

## Current State

The system is intentionally mid-migration:

- most public storefront and editorial pages still render from frontend registries in `frontend/src/lib`
- admin pages and public lead submissions already use the backend
- admin edits do not automatically drive most public pages yet

That split is the most important thing to understand before making content or architecture changes.

## Stack

Frontend:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion

Backend:

- Express
- Prisma
- PostgreSQL
- Zod
- JWT-based admin auth

## Project Structure

- `frontend`
  - Next.js app workspace, frontend env example, app config, assets, and scripts
- `backend`
  - standalone REST API, Prisma schema, migrations, seed script
- `frontend/src/app`
  - public routes, admin routes, and Next route handlers
- `frontend/src/app/admin`
  - admin CMS pages and route-group layouts
- `frontend/src/app/api`
  - Next BFF/proxy routes for admin session management and backend access
- `frontend/src/components`
  - public UI, admin UI, forms, and shared app shell behavior
- `frontend/src/lib`
  - frontend content registries, admin session helpers, backend fetch helpers
- `frontend/public/images`
  - bundled public assets used by the storefront and editorial pages
- `ARCHITECTURE.md`, `CONTENT_MODEL.md`, `WORKFLOWS.md`, `DECISIONS.md`
  - project documentation

## Route Index

Public routes:

- `/`
- `/shop`
- `/shop/[slug]`
- `/collection`
- `/checkout`
- `/ritual`
- `/dashboard`
- `/our-story`
- `/seasonaldrops`
- `/a-seijaku-life`
- `/retreats`
- `/retreats/[slug]`
- `/programs`
- `/programs/adult-unwind`
- `/programs/elder-reset`
- `/programs/teen-senses`
- `/experiences`

Admin routes:

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

Compatibility routes:

- `/shop-all`
- `/lifestyle`
- `/categories/[slug]`

## Running Locally

Frontend:

```bash
npm install
npm run dev:frontend
```

If port `3000` is busy:

```bash
cd frontend
PORT=3001 npm run dev
```

Backend:

```bash
npm install
cd backend
cp .env.example .env
createdb seijaku_backend
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Default local ports:

- frontend: `http://localhost:3000`
- backend: `http://localhost:4001`

If you have a local ignored helper script for your machine, you can also launch the backend with:

```bash
cd backend
./run-backend.local.sh
```

Workspace shortcuts from the repo root:

```bash
npm run dev:frontend
npm run dev:backend
npm run build:frontend
npm run build:backend
npm run build
npm run build:all
```

## Canonical Sources Of Truth

Frontend public rendering:

- `frontend/src/lib/shopAllItems.ts`
- `frontend/src/lib/navigation.ts`
- `frontend/src/lib/retreats.ts`
- Articles are now backend-fed via `frontend/src/lib/seijaku-life-types.ts` → `/content/articles` (Decision #16).

Backend data model and API:

- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`
- `backend/src/routes/public.ts`
- `backend/src/routes/admin.ts`

Next admin/session boundary:

- `frontend/src/lib/admin-session.ts`
- `frontend/src/app/api/admin/session/route.ts`
- `frontend/src/app/api/admin/proxy/[...path]/route.ts`
- `frontend/src/app/api/public/[...path]/route.ts`

## Known Gotchas

- Public catalog and editorial pages still read mostly from `frontend/src/lib`, so backend admin edits do not yet fully update the storefront.
- After switching branches or restructuring workspaces, run `npm install` at the repo root if the app suddenly blanks or reports missing packages.
- The frontend fonts are now self-hosted under `frontend/src/app/fonts`, so builds no longer depend on Google Fonts availability.
- On machines where local PostgreSQL needs a custom socket-based `DATABASE_URL`, the root `npm run dev:backend` script will use `backend/run-backend.local.sh` when that ignored helper exists.
- The backend seeds a bootstrap admin from env values; treat that as setup-only, not a permanent shared credential model.

## Deployment Model

Frontend: **Vercel** (project `seijaku`, Root Directory `frontend/`)

- Production aliases: `https://www.seijaku.co` and `https://seijaku-kappa.vercel.app`
- Production env: `BACKEND_INTERNAL_URL` (points at Render backend), `ADMIN_COOKIE_SECRET`
- Auto-deploys on push to `main`

Backend: **Render Free** (service `seijaku-backend`, Root Directory `backend/`)

- Production URL: `https://seijaku-backend.onrender.com`
- Build command: `npm install && npm run build && npm run prisma:deploy` (migrations run on every deploy)
- Start command: `npm start`
- Production env: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ORIGIN`, `STORAGE_DRIVER=s3`, all `S3_*` vars
- Free tier sleeps after 15 min of inactivity; first request after idle waits 30-50s to wake

Database: **Neon Postgres**
- Pooled URL in `DATABASE_URL`; direct URL in `DATABASE_URL_UNPOOLED` (used for migrations if we ever need it)

Object storage: **Supabase Storage** (S3-compatible)
- Bucket `seijaku-media-prod`, public-read
- Accessed via the S3 driver in `backend/src/lib/storage.ts`
- Uploaded URLs: `https://<project-ref>.supabase.co/storage/v1/object/public/seijaku-media-prod/<filename>`

For production data:

- Prisma migrations run automatically on Render deploy via the build command; no manual step per deploy
- run `npm run prisma:seed` in `backend/` only for initial bootstrap; treat the seed as destructive for non-empty DBs

Current note:

- The root `npm run build` builds frontend only (convenience for historical callers). Use `npm run build:all` for local validation of both workspaces.
- `@aws-sdk/client-s3` is lazy-loaded to keep startup fast.

## GitHub CLI In This Repo

This repo may use a repo-local GitHub CLI wrapper so local `gh` commands can use a different GitHub account than your global CLI session.

```bash
./.git-tools/gh-local auth status
./.git-tools/gh-local pr status
./.git-tools/gh-local repo view
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [CONTENT_MODEL.md](./CONTENT_MODEL.md)
- [WORKFLOWS.md](./WORKFLOWS.md)
- [DECISIONS.md](./DECISIONS.md)
- [backend/README.md](./backend/README.md)

Start with `ARCHITECTURE.md` if you need the system-level picture, and `CONTENT_MODEL.md` if you are touching any user-facing copy or content records.
