import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import RedeemClient from "./RedeemClient";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Info, 
  ShoppingBag, 
  Sparkles 
} from "lucide-react";
import Link from "next/link";

export default async function RedeemPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;

  const session = await getSessionUser();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { merchant: true }, // Include merchant details for branding
  });

  if (!offer || offer.status !== "ACTIVE") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFF] p-6">
        <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4">
          <Info size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 italic tracking-tighter">Offer Unavailable</h1>
        <p className="text-slate-500 font-medium mt-2 mb-8 text-center max-w-xs">
          This perk has expired or is no longer active.
        </p>
        <Link href="/dashboard" className="text-sm font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </main>
    );
  }

  const couponCode = offer.codeTemplate ?? `EDU-${offer.id.slice(-6).toUpperCase()}`;

  return (
    <main className="min-h-screen bg-[#FDFDFF] relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-xl">
        {/* Back Button */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Perks
        </Link>

        <div className="bg-white rounded-[48px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
          
          {/* MERCHANT BRANDING HEADER */}
          <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-full bg-indigo-600/20 blur-3xl rounded-full" />
             
             <div className="relative z-10 flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-white rounded-[24px] flex items-center justify-center text-slate-900 mb-6 shadow-xl">
                    <ShoppingBag size={32} />
                </div>
                <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                    <Sparkles size={12} fill="currentColor" /> Verified Perk
                </div>
                <h1 className="text-3xl font-black tracking-tighter italic leading-tight mb-2">
                    {offer.discountPercent}% Off at {offer.merchant.tradeName}
                </h1>
                <p className="text-slate-400 font-medium text-sm max-w-xs leading-relaxed">
                    {offer.title}
                </p>
             </div>
          </div>

          {/* REDEMPTION CONTENT */}
          <div className="p-10 space-y-8">
            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unlock Details</h3>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                     <ShieldCheck size={10} /> Active
                  </div>
               </div>
               
               {/* This is your enhanced Client Component */}
               <RedeemClient
                 couponCode={couponCode}
                 redirectUrl={offer.redirectUrl}
               />
            </div>

            {/* TRUST & TERMS FOOTER */}
            <div className="pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <Clock size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">One-time Use</p>
                        <p className="text-[10px] font-medium text-slate-400 leading-tight">Code valid for current session</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <ShieldCheck size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Verified ID</p>
                        <p className="text-[10px] font-medium text-slate-400 leading-tight">Exclusively for {session.email?.split('@')[0]}</p>
                    </div>
                </div>
            </div>

            <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                By clicking redeem, you agree to the merchant's specific <br /> terms of service and usage policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}