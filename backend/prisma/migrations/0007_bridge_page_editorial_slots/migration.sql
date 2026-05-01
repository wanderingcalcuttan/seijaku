-- Add editorial-page media slots to ShopBridgePage. The bridge model is
-- being extended (rather than introducing a new editorial-page table) so
-- the existing /admin/bridge-pages CRUD + cache-tag wiring can carry the
-- new slots without parallel infrastructure.
--
-- Bridges with these new slugs are read by the public editorial routes:
--   slug = 'home'                  -> /  (HeroBanner + BrowseWorldSection)
--   slug = 'our-story'             -> /our-story (hero + SplitProcessVideoStrip)
--   slug = 'seasonaldrops-hemanta' -> /seasonaldrops-hemanta
--
-- All columns are nullable. Reversible.

ALTER TABLE "ShopBridgePage"
  ADD COLUMN "homeCard1Image"     TEXT,
  ADD COLUMN "homeCard1Alt"       TEXT,
  ADD COLUMN "homeCard2Image"     TEXT,
  ADD COLUMN "homeCard2Alt"       TEXT,
  ADD COLUMN "homeCard3Image"     TEXT,
  ADD COLUMN "homeCard3Alt"       TEXT,
  ADD COLUMN "homeCard4Image"     TEXT,
  ADD COLUMN "homeCard4Alt"       TEXT,
  ADD COLUMN "ritualVideo1Url"    TEXT,
  ADD COLUMN "ritualVideo1Poster" TEXT,
  ADD COLUMN "ritualVideo2Url"    TEXT,
  ADD COLUMN "ritualVideo2Poster" TEXT,
  ADD COLUMN "formCard1Image"     TEXT,
  ADD COLUMN "formCard1Alt"       TEXT,
  ADD COLUMN "formCard2Image"     TEXT,
  ADD COLUMN "formCard2Alt"       TEXT,
  ADD COLUMN "formCard3Image"     TEXT,
  ADD COLUMN "formCard3Alt"       TEXT,
  ADD COLUMN "formCard4Image"     TEXT,
  ADD COLUMN "formCard4Alt"       TEXT,
  ADD COLUMN "imageBreak1Image"   TEXT,
  ADD COLUMN "imageBreak1Alt"     TEXT,
  ADD COLUMN "imageBreak2Image"   TEXT,
  ADD COLUMN "imageBreak2Alt"     TEXT,
  ADD COLUMN "imageBreak3Image"   TEXT,
  ADD COLUMN "imageBreak3Alt"     TEXT;
