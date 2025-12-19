"use client";

import Input from "@/app/components/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MerchantLoginPage() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const form = e.currentTarget;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        password: (form.elements.namedItem("password") as HTMLInputElement)
          .value,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      if (data.role === "MERCHANT") {
        router.push("/merchant");
      } else {
        setMsg("This account is not a merchant account");
      }
    } else {
      setMsg(data.error || "Login failed");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-indigo-700">
            Merchant sign in
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Access your merchant dashboard
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={submit}
          className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-4"
        >
          <Input name="email" label="Business Email" required />
          <Input
            name="password"
            type="password"
            label="Password"
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {msg && <p className="text-sm text-red-600">{msg}</p>}
        </form>

        <p className="mt-6 text-sm text-slate-600">
          New merchant?{" "}
          <Link
            href="/merchant/register"
            className="text-indigo-600 hover:underline"
          >
            Create merchant account
          </Link>
        </p>

        <p className="mt-2 text-sm text-slate-600">
          Are you a student?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Student login
          </Link>
        </p>
      </div>
    </main>
  );
}
