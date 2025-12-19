import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ offerId: string }> }
) {
  
  const { offerId } = await context.params;

  const session = await getSessionUser();

  if (!session || session.role !== "STUDENT") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!offerId) {
    return NextResponse.json(
      { error: "Missing offer id" },
      { status: 400 }
    );
  }

  
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
  });

  if (!offer || offer.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Invalid offer" },
      { status: 400 }
    );
  }

  
  const student = await prisma.student.findUnique({
    where: { userId: session.userId },
  });

  if (!student) {
    return NextResponse.json(
      { error: "Student profile not found" },
      { status: 400 }
    );
  }

  // generate coupon code
  const code =
    offer.codeTemplate ??
    `EDU-${offer.id.slice(-6).toUpperCase()}`;

  
  const existing = await prisma.redemption.findFirst({
    where: {
      offerId: offer.id,
      studentId: student.id, 
    },
  });

  if (!existing) {
    await prisma.redemption.create({
      data: {
        offerId: offer.id,
        studentId: student.id, 
        method: "CODE",
        tokenId: code,
      },
    });
  }

  return NextResponse.json({ success: true });
}
