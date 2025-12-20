/*
  Warnings:

  - A unique constraint covering the columns `[couponCode]` on the table `Redemption` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[offerId,studentId]` on the table `Redemption` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "discountPercent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "redemptionCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "redirectUrl" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Redemption" ADD COLUMN     "couponCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Redemption_couponCode_key" ON "Redemption"("couponCode");

-- CreateIndex
CREATE INDEX "Redemption_offerId_idx" ON "Redemption"("offerId");

-- CreateIndex
CREATE INDEX "Redemption_studentId_idx" ON "Redemption"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Redemption_offerId_studentId_key" ON "Redemption"("offerId", "studentId");
