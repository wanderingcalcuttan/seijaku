# Seijaku Content Model

## Overview

Seijaku currently has a split content model.

There are two live layers:

1. frontend registries and route-level copy that still drive most public rendering
2. backend normalized records that drive admin CRUD, media relationships, and lead workflows

This document explains which layer is authoritative for which kind of change.

## Source-Of-Truth Split

### Frontend-Owned Public Presentation Content

These files still drive what most visitors actually see on the public site:

- `frontend/src/lib/shopAllItems.ts`
- `frontend/src/lib/navigation.ts`
- route-level page files and components for brand/storytelling sections

Articles, Retreats, Programs, and Shop Bridge Page *metadata* are no longer in this list — all are backend-owned:
- Articles: `publicBackendJson("/content/articles", { tags: ["articles"] })` (Decision #16).
- Retreats: `publicBackendJson("/content/retreats", { tags: ["retreats"] })` (Decision #17).
- Programs: `publicBackendJson("/content/programs", { tags: ["programs", "program-sessions"] })` (Decision #18).
- Shop Bridge Pages AND the product list shown on each `/shop/[slug]`: `publicBackendJson("/catalog/bridge-pages/:slug", { tags: ["bridge-pages", "products"] })` (Decisions #19 and #20).
- `/shop` (Shop-All grid + filters + search): `publicBackendJson("/catalog/products", { tags: ["products"] })` — filter/sort/search stay client-side over the fetched list (Decision #21).
- Home `RitualSetsSection` (Featured Sets, 2 cards), `SearchOverlay`, and `HowSeijakuWorks` dropdown thumbnails: read from backend. `RitualSetsSection` + `SearchOverlay` lazy-fetch the public catalog via `/api/public/catalog/products` on mount / first open; `howSeijakuWorks.options.ts` is pure static data with hand-curated `/images/...` thumbnails (Decision #22).

Still frontend-owned: the `shopProducts` array + related helpers/types in `shopAllItems.ts` serves cart, checkout, `/collection`, Lifestyle Gift Pouch option dropdowns (`lifestyleSetConfig.ts`), and the `seasonaldrops-hemanta` page. Phase 4b.iv onwards sequence these, ending with registry deletion in Phase 4b.final.

Use this layer when:

- changing copy that must appear on the public storefront immediately
- changing route semantics for existing public pages
- changing shop card/detail presentation that still depends on `frontend/src/lib`

### Backend-Owned Normalized Content

These records live in PostgreSQL and are managed through Prisma and the admin UI:

- `Admin`
- `MediaAsset`
- `ProductCategory`
- `Product`
- `ProductMedia`
- `ProductOption`
- `ProductOptionValue`
- `Collection`
- `ShopBridgePage`
- `Article`
- `Retreat`
- `Program`
- `ProgramSession`
- `SeasonalDrop`
- `SiteSetting`

Primary files:

- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`
- `backend/src/routes/admin.ts`
- `backend/src/routes/public.ts`

Use this layer when:

- changing admin-editable content models
- changing API payloads
- changing media relationships
- changing lead workflows
- preparing a domain to move from frontend hardcoded content into backend-managed content

### Transactional Content

These records are backend-owned and already live in the database:

- `OrderRequest`
- `OrderRequestItem`
- `NewsletterSubscription`
- `ProgramReservation`
- `RetreatInquiry`
- `ProductNotification`
- `WishlistItem`
- `RitualEntry`

Current usage:

- newsletter footer form persists to backend
- checkout creates order requests
- program forms create reservations
- retreat forms create inquiries
- Notify Me signups on waitlisted products create product notifications (see `DECISIONS.md` #14)
- wishlist and ritual entries are schema-ready for later use

### Session And Identity Content

Admin identity is split across:

- backend `Admin` records
- a backend JWT
- a Next-signed httpOnly cookie handled by `frontend/src/lib/admin-session.ts`

This is not a customer auth system yet. Customer-facing account state is still mostly local UI state.

## Public Route-To-Content Mapping

### Shop

Current public source:

- `frontend/src/lib/shopAllItems.ts`

Although the backend also has seeded products and bridge pages, the storefront still mostly trusts the frontend registry.

### Navigation

Current public source:

- `frontend/src/lib/navigation.ts`

### Retreats

Current public source: backend-fed (Decision #17). The `/experiences` gallery (`RetreatGallery`) and the `/retreats/[slug]` detail page call `publicBackendJson("/content/retreats", { tags: ["retreats"] })` and `.../content/retreats/:slug`. Admin edits in `/admin/retreats` invalidate the `retreats` tag. The retreat inquiry form on the detail page still writes via `/api/public/lead/retreat-inquiries`.

### Programs

Current public source: backend-fed (Decision #18). The `/programs` index and a single dynamic `/programs/[slug]` detail route call `publicBackendJson("/content/programs", { tags: ["programs", "program-sessions"] })` and `.../content/programs/:slug`. Admin edits in `/admin/programs` and `/admin/program-sessions` invalidate both tags. The reservation form on the detail page still reads sessions from the backend and writes reservations via `/api/public/lead/program-reservations`. The "featured upcoming program" block on `/programs` is data-driven: first program with status `BOOKING_OPEN` that has a future session, using the earliest such session. When nothing qualifies, the block is hidden.

### Editorial

Current public source: backend-fed (Decision #16). The `/a-seijaku-life` index and `/a-seijaku-life/[slug]` pages call `publicBackendJson("/content/articles", { tags: ["articles"] })` and `.../content/articles/:slug`. Admin edits in `/admin/articles` invalidate the `articles` tag on save. Category filter chips are derived dynamically from whatever categories are present in the current dataset, so adding a new category in admin does not require a code change.

### Footer And Checkout Lead Flows

Current backend-owned write paths:

- `/api/public/lead/newsletter-subscriptions`
- `/api/public/lead/order-requests`
- `/api/public/lead/program-reservations`
- `/api/public/lead/retreat-inquiries`

## Admin Route-To-Content Mapping

Admin pages consume backend records through the Next BFF layer.

Examples:

- `/admin/products` -> backend products
- `/admin/bridge-pages` -> backend bridge pages
- `/admin/articles` -> backend articles
- `/admin/retreats` -> backend retreats
- `/admin/programs` -> backend programs
- `/admin/media` -> backend media assets
- `/admin/leads` -> backend lead records
- `/admin/settings` -> backend site settings
- `/admin/team` -> backend admin users

## Asset Model

### Public Bundled Assets

Most public pages still use files under:

- `frontend/public/images`

These asset references are hardcoded inside frontend content registries and components.

### Backend Media Library

The backend also has a `MediaAsset` model and admin media library.

Current purpose:

- admin-side record relationships
- upload support
- future migration path away from hardcoded bundled image references

Important limitation:

Changing a backend media record does not automatically update most public pages today if those pages still point directly at `frontend/public/images` paths in frontend code.

## Canonical Vs Legacy Modules

### Canonical For Current Public Shop Rendering

- `frontend/src/lib/shopAllItems.ts`

### Canonical For Admin/Database Catalog Records

- `backend/prisma/schema.prisma`
- backend `Product` data seeded from `backend/prisma/seed.ts`

### Legacy / Transitional

- `frontend/src/lib/categoryBridge.ts`

This module reflects the older `/categories/*` model and should not be treated as the main commerce source of truth.

## Editing Guidance

When you need to change content, decide which effect you want first:

1. If the public site must visibly change today, update the frontend registry or route-level component that still renders that page.
2. If the change is about admin CRUD, API behavior, leads, schema, or future migration, update the backend model and admin flow.
3. If you are moving a domain from frontend-owned content to backend-owned content, update both the code and these docs in the same change.

## Cache Tags

When a public page starts reading from the backend (via `publicBackendJson` in `frontend/src/lib/backend.ts`), it must declare an explicit `tags: CacheTag[]` list. The admin BFF proxy invalidates those tags on successful writes. Tags are defined in `frontend/src/lib/cache-tags.ts`:

| Tag | Data domain | Invalidated by admin writes on |
|---|---|---|
| `articles` | Editorial `Article` records | `articles/*` |
| `retreats` | `Retreat` records | `retreats/*` |
| `programs` | `Program` records (and cascades from sessions) | `programs/*`, `program-sessions/*` |
| `program-sessions` | `ProgramSession` records | `program-sessions/*`, `programs/*` |
| `products` | `Product` + `ProductMedia` + `ProductOption*` | `products/*`, `categories/*`, `collections/*`, `bridge-pages/*`, `media/*` |
| `bridge-pages` | `ShopBridgePage` (+ product linkages) | `bridge-pages/*`, `products/*`, `categories/*`, `media/*` |
| `collections` | `Collection` (+ product linkages) | `collections/*`, `products/*` |
| `site-settings` | `SiteSetting` singleton (footer, logo, newsletter copy) | `site-settings`, `media/*` |
| `home` | Home page composition (reserved for Phase 5 block work) | — |
| `our-story` | Our Story composition (reserved for Phase 5 block work) | — |
| `ritual` | `/ritual` page step content (reserved for Phase 6 block work) | — |
| `navigation` | Header/footer navigation config (reserved for Phase 7) | — |

The full path-to-tags map is `tagsForAdminWrite(upstreamPath)` in `cache-tags.ts`. Unknown upstream paths fall through to `[]` (fail-safe). When a new admin resource is added, the map must be updated in the same change or the new edits won't invalidate anything.

See `DECISIONS.md` #15 for the full contract.

## Main Limitation

The biggest content-model risk right now is drift between:

- frontend content registries
- backend normalized content records

Until the storefront reads from the backend directly, treat the backend CMS as operational infrastructure plus migration groundwork, not yet a complete public-content source.
