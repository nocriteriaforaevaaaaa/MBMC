import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type AuthPayload = {
  userId: string;
  role: "STUDENT" | "MERCHANT" | "ADMIN";
};

export function signAuthToken(payload: AuthPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

/**
 * Async version — REQUIRED in Next.js 15+
 */
export async function getSessionUser(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AuthPayload;
  } catch {
    return null;
  }
}
