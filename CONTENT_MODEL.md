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
- `frontend/src/lib/retreats.ts`
- `frontend/src/lib/seijakuLifeArticles.ts`
- route-level page files under `frontend/src/app/programs/*`
- route-level page files and components for brand/storytelling sections

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

Current public route content:

- `frontend/src/lib/retreats.ts`
- route-level components in `frontend/src/app/retreats`

The retreat inquiry form itself posts to the backend.

### Programs

Current public route content:

- route-level program pages in `frontend/src/app/programs/*`

The reservation form reads sessions from the backend and writes reservations to the backend.

### Editorial

Current public source:

- `frontend/src/lib/seijakuLifeArticles.ts`

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

## Main Limitation

The biggest content-model risk right now is drift between:

- frontend content registries
- backend normalized content records

Until the storefront reads from the backend directly, treat the backend CMS as operational infrastructure plus migration groundwork, not yet a complete public-content source.
