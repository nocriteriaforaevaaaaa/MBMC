import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const next = form.get("next") as string;

  if (!next) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.redirect(next);
}
