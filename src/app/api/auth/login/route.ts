import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

type AuthPayload = {
  userId: string;
  role: "STUDENT" | "MERCHANT" | "ADMIN";
};

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // 1️⃣ Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      student: true,
      merchant: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // 2️⃣ Check password
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // 3️⃣ STUDENT: must be verified
  if (user.role === "STUDENT") {
    if (user.student?.verificationStatus !== "VERIFIED") {
      return NextResponse.json(
        { error: "Please verify your email first" },
        { status: 403 }
      );
    }
  }

  // 4️⃣ MERCHANT: account exists but approval handled in dashboard
  // (we allow login even if PENDING, dashboard will show "under review")

  // 5️⃣ Create JWT
  const payload: AuthPayload = {
    userId: user.id,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  // 6️⃣ Set cookie
  const res = NextResponse.json({
    success: true,
    role: user.role,
  });

  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
