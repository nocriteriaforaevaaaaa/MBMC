/*
  Warnings:

  - A unique constraint covering the columns `[qrData]` on the table `Redemption` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Redemption" ADD COLUMN     "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "qrData" TEXT,
ADD COLUMN     "verifiedBy" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Redemption_qrData_key" ON "Redemption"("qrData");
