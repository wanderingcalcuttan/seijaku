-- AlterTable: add bridge-page hero/interlude/product-section/SEO extras
ALTER TABLE "ShopBridgePage"
  ADD COLUMN "heroImage" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "heroImageAlt" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "heroImagePosition" TEXT,
  ADD COLUMN "interludeImage" TEXT,
  ADD COLUMN "interludeImageAlt" TEXT,
  ADD COLUMN "productSectionEyebrow" TEXT,
  ADD COLUMN "productSectionTitle" TEXT,
  ADD COLUMN "productSectionDescription" TEXT,
  ADD COLUMN "seoFootnote" TEXT;
