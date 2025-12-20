// app/api/merchant/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signAuthToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, legalName, tradeName, pan, panCardUrl } = await req.json();

    // Validate required fields
    if (!email || !password || !legalName || !pan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Store PAN as uppercase (no format validation)
    const panUpper = pan.toUpperCase();

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "MERCHANT",
      },
    });

    // Create merchant profile
    await prisma.merchant.create({
      data: {
        userId: user.id,
        legalName,
        tradeName: tradeName || null,
        pan: pan.toUpperCase(),
        panCardUrl: panCardUrl || null,
        kycStatus: "PENDING",
        planTier: "FREE",
      },
    });

    // Auto-login merchant with JWT token
    const token = signAuthToken({ userId: user.id, role: user.role });

    const res = NextResponse.json({
      success: true,
      role: user.role,
      message: "Account created successfully",
    });

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}