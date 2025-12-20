"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, User, ShieldCheck, Loader2, ArrowRight } from "lucide-react";

/* --- Reusable Input Component --- */
function Input({ label, name, type = "text", required = false }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black uppercase tracking-widest text-[#3C1A0D]/40 ml-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-2xl border border-orange-100 bg-white px-5 py-4 text-sm font-bold text-[#3C1A0D] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-[#3C1A0D]/20"
      />
    </div>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const form = e.currentTarget;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: (form.elements.namedItem("email") as HTMLInputElement).value,
          password: (form.elements.namedItem("password") as HTMLInputElement).value,
          selectedRole: "ADMIN",
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.role === "ADMIN") {
        router.push("/admin");
      } else {
        setMsg("Invalid admin credentials");
      }
    } catch {
      setLoading(false);
      setMsg("Connection error. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF5EE] text-[#3C1A0D] flex items-center justify-center px-6 relative overflow-hidden font-sans">
      {/* BACKGROUND ORBS */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-200/30 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-300/20 blur-[120px]" />

      <div className="w-full max-w-[480px] relative z-10">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="h-14 w-14 rounded-2xl bg-[#3C1A0D] flex items-center justify-center shadow-xl mb-4">
            <ShieldCheck className="text-white" size={30} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">
            EduPerks<span className="text-orange-600">.</span>
          </h1>
          <p className="text-[#3C1A0D]/60 font-black uppercase tracking-widest text-[10px] mt-2">
            Admin Control Panel
          </p>
        </div>

        {/* ROLE TABS */}
        <div className="bg-orange-100/30 p-1.5 rounded-[24px] flex mb-8 border border-white backdrop-blur-sm shadow-sm">
          <Link
            href="/login"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest text-[#3C1A0D]/40 hover:text-orange-600"
          >
            <User size={14} /> Student
          </Link>

          <Link
            href="/merchant/login"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest text-[#3C1A0D]/40 hover:text-orange-600"
          >
            <Store size={14} /> Merchant
          </Link>

          <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] bg-[#3C1A0D] text-white shadow-lg text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} /> Admin
          </div>
        </div>

        {/* ADMIN LOGIN CARD */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-10 shadow-[0_32px_64px_-16px_rgba(255,120,0,0.1)] border border-white">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">Admin Login</h2>
            <div className="h-1 w-12 bg-orange-600 mt-2 rounded-full" />
            <p className="text-xs font-medium text-[#3C1A0D]/50 mt-4">
              Manage users, merchants, and platform activity.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <Input name="email" label="Admin Email Address" required />
            <Input name="password" type="password" label="Password" required />

            <button
              disabled={loading}
              className="w-full group flex items-center justify-center gap-3 rounded-2xl bg-[#3C1A0D] py-5 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 disabled:opacity-70 active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Enter Admin Panel
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {msg && (
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-center">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                  {msg}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center">
          <Link
            href="/login"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3C1A0D]/30 hover:text-orange-600"
          >
            Back to Student Login
          </Link>
        </div>
      </div>
    </main>
  );
}
