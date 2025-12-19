import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getSessionUser();

  if (!session || session.role !== "MERCHANT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.userId },
  });

  if (!merchant || merchant.kycStatus !== "APPROVED") {
    return NextResponse.json(
      { error: "Merchant not approved" },
      { status: 403 }
    );
  }

  const form = await req.formData();

  const title = form.get("title") as string;
  const description = form.get("description") as string;
  const category = form.get("category") as string;
  const redirectUrl = form.get("redirectUrl") as string;
  const discountPercent = Number(form.get("discountPercent"));

  // ✅ Validation FIRST
  if (!redirectUrl || redirectUrl.trim() === "") {
    return NextResponse.json(
      { error: "Redirect URL is required" },
      { status: 400 }
    );
  }

  if (!title || !description || !category) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  await prisma.offer.create({
    data: {
      merchantId: merchant.id,
      title,
      description,
      category,
      discountPercent,
      redirectUrl,
      status: "ACTIVE",
      startAt: new Date(),
      endAt: new Date(Date.now() + 30 * 86400000),
    },
  });

  return NextResponse.redirect(new URL("/merchant", req.url));
}
