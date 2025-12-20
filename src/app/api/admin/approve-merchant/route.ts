// app/api/admin/approve-merchant/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();

    // Check admin authorization
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const merchantId = formData.get("merchantId") as string;

    if (!merchantId) {
      return NextResponse.json(
        { error: "Merchant ID required" },
        { status: 400 }
      );
    }

    // Update merchant KYC status to APPROVED
    await prisma.merchant.update({
      where: { id: merchantId },
      data: { kycStatus: "APPROVED" },
    });

    // Log the approval in audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.userId,
        entity: "MERCHANT",
        entityId: merchantId,
        action: "KYC_APPROVED",
        meta: {
          approvedBy: session.email,
          approvedAt: new Date().toISOString(),
        },
      },
    });

    // Redirect back to admin dashboard
    return NextResponse.redirect(new URL("/admin", req.url));
  } catch (error) {
    console.error("Approve merchant error:", error);
    return NextResponse.json(
      { error: "Failed to approve merchant" },
      { status: 500 }
    );
  }
}