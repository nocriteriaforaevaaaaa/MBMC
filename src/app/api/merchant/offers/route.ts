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

  const formData = await req.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const redirectUrl = formData.get("redirectUrl") as string;
  const discountPercent = Number(formData.get("discountPercent") || 0);
  const imageFile = formData.get("image") as File | null;

  if (!title || !description || !category || !redirectUrl) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // 🔹 Convert image → Base64
  let imageUrl: string | undefined;

  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > 500_000) {
      return NextResponse.json(
        { error: "Image too large (max 500KB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    imageUrl = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
  }

  const offer = await prisma.offer.create({
    data: {
      merchantId: merchant.id,
      title,
      description,
      category,
      discountPercent,
      redirectUrl,
      startAt: new Date(),
      endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
      imageUrl, // ✅ MATCHES YOUR SCHEMA
    },
  });

return NextResponse.redirect(
  new URL("/merchant", req.url)
);}
