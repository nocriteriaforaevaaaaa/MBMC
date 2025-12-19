import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("auth_token")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 200 });

  const payload = verifyAuthToken(token);
  if (!payload) return NextResponse.json({ user: null }, { status: 200 });

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { student: true },
  });

  return NextResponse.json({ user });
}
