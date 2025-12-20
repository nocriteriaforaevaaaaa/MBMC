"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, Building2, CheckCircle2, Zap, ShieldCheck } from "lucide-react";

/* --- Reusable Input Component to match theme --- */
function Input({ label, name, type = "text", placeholder, required = false }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black uppercase tracking-widest text-[#3C1A0D]/40 ml-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-orange-100 bg-white px-5 py-4 text-sm font-bold text-[#3C1A0D] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-[#3C1A0D]/20"
      />
    </div>
  );
}

export default function MerchantRegisterPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const form = e.currentTarget;

    try {
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
    } catch (err) {
      setLoading(false);
      setMsg("Connection error. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF5EE] text-[#3C1A0D] flex items-center justify-center py-12 px-6 relative overflow-hidden font-sans">
      {/* BACKGROUND ORBS */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-200/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-300/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[520px] relative z-10">
        {/* LOGO SECTION */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="h-14 w-14 rounded-2xl bg-orange-600 flex items-center justify-center shadow-xl shadow-orange-200 mb-4">
            <ShieldCheck className="text-white" size={30} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-[#3C1A0D]">
            EduPerks<span className="text-orange-600">.</span>
          </h1>
          <p className="text-[#3C1A0D]/60 font-bold uppercase tracking-widest text-[10px] mt-2">
            Global Merchant Partnership
          </p>
        </div>

        {/* REGISTRATION CARD */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(255,120,0,0.1)] border border-white relative overflow-hidden">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-orange-600 fill-orange-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Growth Portal</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#3C1A0D]">Partner with us</h2>
            <p className="text-sm font-medium text-[#3C1A0D]/50 mt-2 leading-relaxed">
              Reach thousands of verified students with exclusive targeted offers.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
              <Input name="legalName" label="Legal Business Name" placeholder="Acme Corp Pvt Ltd" required />
              <Input name="tradeName" label="Store/Trade Name" placeholder="Acme Fashion" required />
              <Input name="email" type="email" label="Business Email" placeholder="partner@company.com" required />
              <Input name="password" type="password" label="Create Password" required />
            </div>

            {/* Benefit Bullets */}
            <div className="py-4 space-y-3 bg-orange-50/50 rounded-3xl px-6 border border-orange-100/50">
              <div className="flex items-center gap-3 text-[9px] font-black text-[#3C1A0D]/60 uppercase tracking-widest">
                <CheckCircle2 size={16} className="text-orange-600" /> Instant verification access
              </div>
              <div className="flex items-center gap-3 text-[9px] font-black text-[#3C1A0D]/60 uppercase tracking-widest">
                <CheckCircle2 size={16} className="text-orange-600" /> Full analytics dashboard
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full group relative flex items-center justify-center gap-3 rounded-2xl bg-[#3C1A0D] py-5 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 disabled:opacity-70 active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Start Partnership
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {msg && (
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-center animate-in fade-in zoom-in-95">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                  {msg}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center space-y-6">
          <p className="text-sm font-medium text-[#3C1A0D]/50">
            Already have a partner account?{" "}
            <Link href="/merchant/login" className="text-orange-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>

          <div className="h-[1px] w-12 bg-orange-200 mx-auto" />

          <Link
            href="/register"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3C1A0D]/30 hover:text-orange-600 transition-colors block"
          >
            Are you a student? Create Student Account
          </Link>
        </div>
      </div>
    </main>
  );
}