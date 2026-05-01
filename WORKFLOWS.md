# Seijaku Workflows

## Frontend Local Setup

Install frontend dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev:frontend
```

If port `3000` is already taken:

```bash
cd frontend
PORT=3001 npm run dev
```

## Backend Local Setup

Install backend dependencies:

```bash
cd backend
npm install
```

Create env and database:

```bash
cp .env.example .env
createdb seijaku_backend
```

Run Prisma and seed:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```

Start the backend:

```bash
cd backend
npm run dev
```

Default backend port:

- `http://localhost:4001`

If your machine has a local ignored launcher script configured, you can also use:

```bash
./run-backend.local.sh
```

Or from the repo root:

```bash
npm run dev:backend
```

That root script will use `backend/run-backend.local.sh` automatically when the ignored helper exists on the local machine.

## Everyday Startup

Typical local startup sequence:

```bash
# terminal 1
cd /path/to/seijaku
npm run dev:frontend

# terminal 2
cd /path/to/seijaku/backend
npm run dev
```

Then open:

- frontend: `http://localhost:3000` or `http://localhost:3001`
- backend health: `http://localhost:4001/health`
- admin login: `http://localhost:3000/admin/login` or `http://localhost:3001/admin/login`

## Validation Commands

Frontend typecheck:

```bash
cd frontend
npx tsc --noEmit
```

Backend build:

```bash
npm run build:backend
```

That backend build path runs Prisma client generation before TypeScript compile, which keeps clean installs and future backend deployments from failing on a missing generated client. **Local `npm run build:backend` never touches a remote database.**

On Vercel, the backend uses `scripts/vercel-build.sh` (invoked as `npm run vercel-build`). On Production builds only, that script runs `prisma migrate deploy` against the unpooled Postgres URL after generate + compile. Preview and Development Vercel builds skip the migrate step. To run migrations manually against prod from a local machine (emergency only), cd into `backend/` and run `npx prisma migrate deploy` with `DATABASE_URL` pointed at the unpooled Neon URL.

Full frontend + backend validation from the repo root:

```bash
npm run build:all
```

Backend health check:

```bash
curl -sS http://localhost:4001/health
```

## Admin Workflow

Admin auth flows through the Next app, not directly from the browser to the backend.

Current behavior:

- visit `/admin/login`
- submit admin email and password
- Next stores a signed httpOnly session cookie
- protected admin routes use that cookie to reach backend `/admin/*`

Bootstrap admin credentials come from backend env values:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Treat those as bootstrap-only credentials and rotate/manage admins through the app afterward.

## Editorial Media Upload Workflow (Decision #31)

Admins control the media on `/`, `/our-story`, `/seasonaldrops-hemanta`, and the four `/shop/*` bridge pages from a single admin form:

1. Log into `/admin/login`.
2. Open `/admin/bridge-pages`. Pick the bridge whose slug matches the route you want to edit:
   - `home` → home page hero + four "Explore fragrance rituals" card images
   - `our-story` → hero + the two "In the Making — Rituals take form" video loops + posters
   - `seasonaldrops-hemanta` → hero + four form-character images + three image breaks
   - `perfumes` / `diffusers` / `lifestyle` / `scarves-and-squares` / `dokra-ornaments` → shop bridge hero + interlude + intro + post-CTA copy
3. Each image field has an "Upload image" button that POSTs to the existing `/admin/media/upload` route. Uploads land in the Supabase bucket `seijaku-media-prod`. The returned URL is written into the bridge column.
4. Save → tag-cache invalidation fires → public page picks up the new media within ~5s.

Notes:

- The form is long. Field labels are slug-prefixed (e.g. `Home / Card 1 image`, `Hemanta / Form card 2 image`) so you can scan past fields that don't apply to the bridge you're editing.
- All editorial fields are optional. When blank, the public page falls back to the bundled-asset path it shipped with — no surface goes blank during partial setup.
- Field-level Zod errors surface in the save banner (e.g. `Validation failed — heroTitle: Expected string, received empty`). The empty-string and JSON-vs-null deserialization issues that affected blank optional fields were fixed in PRs #53 and #54.

## Public Lead Workflow

These public flows now persist to the backend:

- footer newsletter signup
- checkout order request
- program reservation forms
- retreat inquiry forms

Important caveat:

- lead submissions are backend-backed
- most public content reads are still frontend-backed

So the app is currently mixed-mode rather than fully API-driven.

## Branch Switching

When switching branches, especially after dependency changes:

```bash
git pull --ff-only
npm install
```

If the backend changed too:

```bash
npm install
```

## Blank Page Recovery

If the frontend suddenly looks broken after a pull:

1. Confirm the dev server is still running.
2. Restart it.
3. Run `npm install` at the repo root.
4. Re-check the browser.

This repo has already hit missing-dependency issues after branch switches.

## Build Caveats

- The frontend now self-hosts its fonts from `frontend/src/app/fonts`.
- Frontend production builds should no longer need Google Fonts network access.
- The root `npm run build` command intentionally builds the frontend only so the current Vercel frontend project can keep passing while it still targets the repo root.
- Use `npm run build:all` when you want local validation of both workspaces together.
- The frontend build intentionally sets `NEXT_IGNORE_INCORRECT_LOCKFILE=1` to avoid Next's lockfile patcher breaking inside the npm workspace layout.

## Repo-Local Git Identity

Check the git identity used only in this repo:

```bash
git config --local --get user.name
git config --local --get user.email
```

## Repo-Local GitHub CLI Workflow

This repo may use a local `gh` wrapper so repo commands can use a different GitHub account than your global CLI session.

Repo-local checks:

```bash
./.git-tools/gh-local auth status
./.git-tools/gh-local pr status
./.git-tools/gh-local repo view
```

Global check:

```bash
gh auth status
```

## Documentation Workflow

Before changing route ownership, content ownership, or backend/frontend boundaries, check:

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [CONTENT_MODEL.md](./CONTENT_MODEL.md)
- [DECISIONS.md](./DECISIONS.md)

If a change moves a source of truth, update those docs in the same change.
