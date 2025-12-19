"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const form = e.currentTarget;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        password: (form.elements.namedItem("password") as HTMLInputElement).value,
        college: (form.elements.namedItem("college") as HTMLInputElement).value,
        program: (form.elements.namedItem("program") as HTMLInputElement).value,
        year: (form.elements.namedItem("year") as HTMLInputElement).value,
      }),
    });

    const data = await res.json();
    setMsg(data.message || data.error);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-indigo-700">
            Create account
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Use your college email to get verified
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={submit}
          className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-4"
        >
          <Input name="email" label="Email" placeholder="you@college.edu.np" required />
          <Input name="password" type="password" label="Password" required />
          <Input name="college" label="College" />
          <Input name="program" label="Program" />
          <Input name="year" label="Year" />

          <button
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          {msg && (
            <p className="text-sm text-center text-slate-700">{msg}</p>
          )}
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

/* ---------- Input ---------- */
function Input({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
