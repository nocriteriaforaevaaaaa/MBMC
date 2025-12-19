import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const offers = await prisma.offer.findMany({
    where: { status: "DRAFT" },
    include: { merchant: { select: { tradeName: true, legalName: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ offers });
}
