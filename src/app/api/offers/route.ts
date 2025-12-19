import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = new Date();

  const offers = await prisma.offer.findMany({
    where: {
      status: "ACTIVE",
      startAt: { lte: now },
      endAt: { gte: now },
    },
    include: { merchant: { select: { tradeName: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ offers });
}
