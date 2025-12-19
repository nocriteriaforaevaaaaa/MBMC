"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MerchantRegisterPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const form = e.currentTarget;

    const res = await fetch("/api/merchant/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        password: (form.elements.namedItem("password") as HTMLInputElement).value,
        legalName: (form.elements.namedItem("legalName") as HTMLInputElement).value,
        tradeName: (form.elements.namedItem("tradeName") as HTMLInputElement).value,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push("/merchant");
    } else {
      setMsg(data.error || "Registration failed");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 px-6">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-1 text-indigo-700">
          Create Merchant Account
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Submit offers to be approved and shown to students
        </p>

        <form onSubmit={submit} className="space-y-3">
          <input name="email" placeholder="Business email" required />
          <input name="password" type="password" placeholder="Password" required />
          <input name="legalName" placeholder="Legal business name" required />
          <input name="tradeName" placeholder="Store name (optional)" />

          <button
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create merchant account"}
          </button>
        </form>

        {msg && <p className="mt-4 text-sm text-red-600">{msg}</p>}

        <p className="mt-6 text-sm text-slate-600 text-center">
          Already have a merchant account?{" "}
          <a
            href="login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
