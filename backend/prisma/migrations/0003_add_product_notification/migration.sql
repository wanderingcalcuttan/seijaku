-- CreateTable
CREATE TABLE "ProductNotification" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "customerId" TEXT,
    "email" TEXT NOT NULL,
    "source" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notifiedAt" TIMESTAMP(3),

    CONSTRAINT "ProductNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductNotification_productId_idx" ON "ProductNotification"("productId");

-- CreateIndex
CREATE INDEX "ProductNotification_email_idx" ON "ProductNotification"("email");

-- CreateIndex: idempotency — one notification row per product+email pair.
CREATE UNIQUE INDEX "ProductNotification_productId_email_key" ON "ProductNotification"("productId", "email");

-- AddForeignKey
ALTER TABLE "ProductNotification" ADD CONSTRAINT "ProductNotification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductNotification" ADD CONSTRAINT "ProductNotification_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
