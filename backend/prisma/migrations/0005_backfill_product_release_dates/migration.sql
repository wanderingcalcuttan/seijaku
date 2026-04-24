-- Backfill Product.releaseDate from the static editorial lookup that
-- previously lived in frontend/src/lib/shop-taxonomy.ts
-- (shopProductReleaseDates). The column existed since 0001_init but was
-- seeded as NULL; this migration preserves the pre-migration /shop "Newest"
-- sort order on prod so day-one UX after the frontend swap is unchanged.
--
-- Safe to re-run: UPDATE ... WHERE slug = ... AND "releaseDate" IS NULL
-- keeps admin edits (non-null values set via the admin UI) untouched.
-- Slugs that do not exist in the Product table are no-ops (three of the
-- historical entries are program / retreat slugs, which live in other
-- tables; they simply don't match any row here).

UPDATE "Product" SET "releaseDate" = '2026-03-12T00:00:00.000Z' WHERE slug = 'quiet-tea-ritual-box' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-03-08T00:00:00.000Z' WHERE slug = 'reading-hour-set' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-03-03T00:00:00.000Z' WHERE slug = 'dawn-reset-box' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-02-25T00:00:00.000Z' WHERE slug = 'evening-unwind-gift-set' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-03-15T00:00:00.000Z' WHERE slug = 'smoke-tea-parfum' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-03-10T00:00:00.000Z' WHERE slug = 'saffron-plum-attar' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-03-01T00:00:00.000Z' WHERE slug = 'neroli-linen-mist' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-02-20T00:00:00.000Z' WHERE slug = 'hinoki-morning-oil' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-03-11T00:00:00.000Z' WHERE slug = 'table-ritual-napkin-pair' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-03-05T00:00:00.000Z' WHERE slug = 'tea-room-pocket-square' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-02-28T00:00:00.000Z' WHERE slug = 'rain-quiet-wrap' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-02-18T00:00:00.000Z' WHERE slug = 'mulberry-dawn-scarf' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-03-14T00:00:00.000Z' WHERE slug = 'clay-vessel-diffuser' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-03-07T00:00:00.000Z' WHERE slug = 'reed-diffuser-cedar-smoke' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-02-27T00:00:00.000Z' WHERE slug = 'brass-tea-light-diffuser' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-02-22T00:00:00.000Z' WHERE slug = 'stone-oil-diffuser' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-03-13T00:00:00.000Z' WHERE slug = 'threshold-bell-ornament' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-03-09T00:00:00.000Z' WHERE slug = 'dokra-bird-figure' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-02-26T00:00:00.000Z' WHERE slug = 'dokra-talisman-pair' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-02-19T00:00:00.000Z' WHERE slug = 'quiet-lamp-charm' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-03-06T00:00:00.000Z' WHERE slug = 'adult-unwind-program' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-02-24T00:00:00.000Z' WHERE slug = 'elder-reset-program' AND "releaseDate" IS NULL;
UPDATE "Product" SET "releaseDate" = '2026-02-16T00:00:00.000Z' WHERE slug = 'autumn-quiet-retreat' AND "releaseDate" IS NULL;
