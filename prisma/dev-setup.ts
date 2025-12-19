import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  const merchantEmail = "merchant@test.com";
  const adminEmail = "admin@test.com";

  const passwordHash = crypto.createHash("sha256").update("test1234").digest("hex");

  // Admin
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: { email: adminEmail, passwordHash, role: "ADMIN" },
  });

  // Merchant user
  const merchantUser = await prisma.user.upsert({
    where: { email: merchantEmail },
    update: { role: "MERCHANT" },
    create: { email: merchantEmail, passwordHash, role: "MERCHANT" },
  });

  // Merchant profile (APPROVED so they can submit offers)
  await prisma.merchant.upsert({
    where: { userId: merchantUser.id },
    update: { kycStatus: "APPROVED", planTier: "FREE" },
    create: {
      userId: merchantUser.id,
      legalName: "Test Merchant Pvt Ltd",
      tradeName: "Cool Store",
      kycStatus: "APPROVED",
      planTier: "FREE",
    },
  });

  console.log("✅ Admin + Merchant test accounts created");
  console.log("admin@test.com / test1234");
  console.log("merchant@test.com / test1234");
}

main().finally(() => prisma.$disconnect());
