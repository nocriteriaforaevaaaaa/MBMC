"use client";
import Input from "@/app/components/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, Loader2, ArrowRight, Building2, CheckCircle } from "lucide-react";

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
    <main className="min-h-screen bg-[#FDFDFF] text-slate-900 flex items-center justify-center py-12 px-6 relative overflow-hidden">
      {/* BACKGROUND MESH BLURS - Merchant Emerald Theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-100/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-100/30 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[480px] relative z-10">
        {/* LOGO SECTION */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-10 group">
          <div className="h-10 w-10 bg-gradient-to-tr from-emerald-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-white font-black italic">EP</span>
          </div>
          <span className="text-2xl font-black tracking-tighter italic text-slate-900">
            Edu<span className="text-emerald-600">Perks</span>
          </span>
        </Link>

        {/* REGISTRATION CARD */}
        <div className="bg-white rounded-[40px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
          {/* Decorative Badge */}
          <div className="absolute top-0 right-0 p-8">
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Building2 size={24} />
            </div>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
              Partner with us
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Join hundreds of brands reaching verified students globally.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
              <Input name="legalName" label="Legal Business Name" placeholder="e.g. Acme Corp Pvt Ltd" required />
              <Input name="tradeName" label="Store/Trade Name" placeholder="e.g. Acme Fashion" required />
              <Input name="email" type="email" label="Business Email" placeholder="partner@company.com" required />
              <Input name="password" type="password" label="Create Password" required />
            </div>

            {/* Benefit Bullets */}
            <div className="py-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <CheckCircle size={14} className="text-emerald-500" /> Instant verification access
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <CheckCircle size={14} className="text-emerald-500" /> Merchant dashboard included
                </div>
            </div>

            <button
              disabled={loading}
              className="w-full group relative flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-slate-900 transition-all shadow-xl shadow-emerald-100 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Start Partnership
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {msg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center animate-in fade-in slide-in-from-top-2">
                <p className="text-xs font-bold text-rose-600 uppercase tracking-tighter">{msg}</p>
              </div>
            )}
          </form>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center space-y-6">
          <p className="text-sm font-medium text-slate-500">
            Already have a partner account?{" "}
            <Link href="/merchant/login" className="text-emerald-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
          
          <div className="h-[1px] w-12 bg-slate-200 mx-auto" />
          
          <Link href="/register" className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest block transition-colors">
             Are you a student? Create Student Account
          </Link>
        </div>
      </div>
    </main>
  );
}