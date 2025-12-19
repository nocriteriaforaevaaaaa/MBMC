import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signAuthToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password, legalName, tradeName } = await req.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "MERCHANT",
    },
  });

  await prisma.merchant.create({
    data: {
      userId: user.id,
      legalName,
      tradeName: tradeName || null,
      kycStatus: "PENDING", // (optional) you can require admin approval later
      planTier: "FREE",
    },
  });

  // Auto-login merchant
  const token = signAuthToken({ userId: user.id, role: user.role });

  const res = NextResponse.json({ success: true, role: user.role });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
