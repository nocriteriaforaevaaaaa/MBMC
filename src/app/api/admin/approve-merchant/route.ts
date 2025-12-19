import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSessionUser();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const merchantId = formData.get("merchantId") as string;

  if (!merchantId) {
    return NextResponse.json({ error: "Missing merchantId" }, { status: 400 });
  }

  await prisma.merchant.update({
    where: { id: merchantId },
    data: { kycStatus: "APPROVED" },
  });

  return NextResponse.redirect(new URL("/admin", req.url));
}
