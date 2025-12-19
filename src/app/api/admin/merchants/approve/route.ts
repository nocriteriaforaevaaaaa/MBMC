import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { merchantId } = await req.json();

  await prisma.merchant.update({
    where: { id: merchantId },
    data: { kycStatus: "APPROVED" },
  });

  return NextResponse.json({ success: true });
}
