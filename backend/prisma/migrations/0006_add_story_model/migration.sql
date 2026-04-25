-- Add Story model: monthly admin-curated homepage section ("How Seijaku
-- Works") that picks 3 perfume products + 3 artifact products + a video URL.
-- Public read selects the latest active story whose launchDate has passed.
-- See Decision #29.

-- StoryStatus enum
CREATE TYPE "StoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- Story table
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "perfume1Id" TEXT NOT NULL,
    "perfume2Id" TEXT NOT NULL,
    "perfume3Id" TEXT NOT NULL,
    "artifact1Id" TEXT NOT NULL,
    "artifact2Id" TEXT NOT NULL,
    "artifact3Id" TEXT NOT NULL,
    "launchDate" TIMESTAMP(3) NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "status" "StoryStatus" NOT NULL DEFAULT 'INACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- Index for the public-read query: WHERE status='ACTIVE' AND launchDate <= NOW() ORDER BY launchDate DESC LIMIT 1
CREATE INDEX "Story_status_launchDate_idx" ON "Story"("status", "launchDate");

-- Foreign keys to Product. Restrict deletion of any product referenced by a
-- story so the story stays internally consistent. Admin must remove the
-- reference (or delete the story) before deleting the product.
ALTER TABLE "Story" ADD CONSTRAINT "Story_perfume1Id_fkey" FOREIGN KEY ("perfume1Id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Story" ADD CONSTRAINT "Story_perfume2Id_fkey" FOREIGN KEY ("perfume2Id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Story" ADD CONSTRAINT "Story_perfume3Id_fkey" FOREIGN KEY ("perfume3Id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Story" ADD CONSTRAINT "Story_artifact1Id_fkey" FOREIGN KEY ("artifact1Id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Story" ADD CONSTRAINT "Story_artifact2Id_fkey" FOREIGN KEY ("artifact2Id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Story" ADD CONSTRAINT "Story_artifact3Id_fkey" FOREIGN KEY ("artifact3Id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
