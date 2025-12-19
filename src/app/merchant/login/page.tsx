"use client";
import Input from "@/app/components/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, User, ShieldCheck, Loader2, ArrowRight, Briefcase } from "lucide-react";

export default function MerchantLoginPage() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        if (data.role === "MERCHANT") {
          router.push("/merchant");
        } else {
          setMsg("This account is not registered as a merchant.");
        }
      } else {
        setMsg(data.error || "Login failed");
      }
    } catch (err) {
      setLoading(false);
      setMsg("Connection error. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFDFF] text-slate-900 flex items-center justify-center px-6 relative overflow-hidden">
      {/* BACKGROUND MESH BLURS - Using Merchant Emerald/Indigo Tones */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-100/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-100/40 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10">
        {/* LOGO SECTION */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-10 group">
          <div className="h-9 w-9 bg-gradient-to-tr from-emerald-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-white font-black italic text-sm">EP</span>
          </div>
          <span className="text-2xl font-black tracking-tighter italic">
            Edu<span className="text-emerald-600 font-black">Perks</span>
          </span>
        </Link>

        {/* ROLE TABS - Pre-selected to Merchant */}
        <div className="bg-slate-100/50 p-1 rounded-2xl flex mb-8 border border-slate-200/50 backdrop-blur-sm">
          <Link href="/login" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">
            <User size={14} /> Student
          </Link>
          <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white text-emerald-600 shadow-sm border border-slate-100">
            <Store size={14} /> Merchant
          </div>
          <Link href="/admin/login" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">
            <ShieldCheck size={14} /> Admin
          </Link>
        </div>

        {/* MERCHANT LOGIN CARD */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Partner Login</h2>
              <p className="text-sm text-slate-500 font-medium">Manage your brand and offers</p>
            </div>
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Briefcase size={24} />
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1">
              <Input name="email" label="Business Email Address" required />
            </div>
            <div className="space-y-1">
              <Input name="password" type="password" label="Password" required />
              <div className="text-right">
                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600">
                  Forgot Password?
                </Link>
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
                  Access Dashboard
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {msg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-center">
                <p className="text-xs font-bold text-rose-600 uppercase tracking-tighter">{msg}</p>
              </div>
            )}
          </form>
        </div>

        {/* MERCHANT SPECIFIC FOOTER */}
        <div className="mt-10 text-center space-y-4">
          <p className="text-sm font-medium text-slate-500">
            Want to reach 10k+ students?{" "}
            <Link href="/merchant/register" className="text-emerald-600 font-bold hover:underline">
              Become a Partner
            </Link>
          </p>
          <div className="h-[1px] w-12 bg-slate-200 mx-auto" />
          <Link href="/login" className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest block">
             Not a Merchant? Go to Student Login
          </Link>
        </div>
      </div>
    </main>
  );
}