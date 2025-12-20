import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import RedeemClient from "./RedeemClient";
import { 
  ArrowLeft, 
  ShieldCheck, 
  ShoppingBag, 
  Sparkles,
  CheckCircle2,
  Zap,
  LayoutDashboard,
  Ticket
} from "lucide-react";
import Link from "next/link";

function generateCouponCode(offerId: string, studentId: string): string {
  const offerPart = offerId.slice(-4).toUpperCase();
  const studentPart = studentId.slice(-4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EDU-${offerPart}-${studentPart}-${random}`;
}

export default async function RedeemPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;
  const session = await getSessionUser();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const student = await prisma.student.findUnique({
    where: { userId: session.userId },
  });

  if (!student) redirect("/login");

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { 
      merchant: true,
      redemptions: { where: { studentId: student.id } },
    },
  });

  if (!offer || offer.status !== "ACTIVE") redirect("/dashboard");

  const existingRedemption = offer.redemptions[0];
  const alreadyRedeemed = !!existingRedemption;
  let redemptionId: string;
  let couponCode: string;

  if (!alreadyRedeemed) {
    couponCode = generateCouponCode(offerId, student.id);
    const redemption = await prisma.$transaction(async (tx) => {
      const newRedemption = await tx.redemption.create({
        data: { 
          couponCode, 
          offerId, 
          studentId: student.id, 
          method: offer.redemptionType, 
          status: "ISSUED", 
          redeemedAt: new Date() 
        },
      });
      await tx.offer.update({ 
        where: { id: offerId }, 
        data: { redemptionCount: { increment: 1 } } 
      });
      return newRedemption;
    });
    redemptionId = redemption.id;
    couponCode = redemption.couponCode;
  } else {
    redemptionId = existingRedemption.id;
    couponCode = existingRedemption.couponCode;
  }

  return (
    <div className="min-h-screen bg-[#FFF5EE] flex font-sans text-[#3C1A0D]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#3C1A0D] text-white flex flex-col p-8 hidden lg:flex sticky top-0 h-screen border-r border-orange-900/20">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/40">
            <ShieldCheck size={20} strokeWidth={2.5} />
          </div>
          <span className="font-black tracking-tight text-xl uppercase italic">
            Edu<span className="text-orange-600">Perks</span>
          </span>
        </div>
        <nav className="space-y-2 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-900/20 transition-transform active:scale-95">
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
            <Ticket size={16} /> My Claims
          </Link>
        </nav>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-1">Student Verified</p>
          <p className="text-[11px] font-bold text-orange-200 italic">#{student.id.slice(-8).toUpperCase()}</p>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-10 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/10 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-2xl mx-auto">
          {/* MINIMAL TOP NAV */}
          <div className="flex justify-between items-center mb-6 px-2">
            <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#3C1A0D]/40 hover:text-orange-600 transition-all">
              <ArrowLeft size={14} /> Back
            </Link>
            <p className="text-[9px] font-black text-orange-900/30 uppercase tracking-widest italic">{session.email}</p>
          </div>

          {/* VOUCHER CARD */}
          <div className="bg-white rounded-[40px] shadow-[0_32px_80px_-20px_rgba(60,26,13,0.12)] border border-white overflow-hidden">
            
            {/* SLIM BRAND STRIP */}
            <div className="bg-[#3C1A0D] px-8 py-6 text-white relative flex items-center justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-full bg-orange-600/20 blur-[30px]" />
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-[#3C1A0D] shadow-lg rotate-2">
                  <ShoppingBag size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">Exclusive Offer</span>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-[9px] font-bold text-white/40">{new Date(offer.endAt).toLocaleDateString()}</span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-none">
                    {offer.discountPercent}% OFF <span className="text-orange-600">@{offer.merchant.tradeName}</span>
                  </h1>
                </div>
              </div>
              <Zap size={24} className="text-orange-600/30 hidden sm:block" />
            </div>

            {/* MAIN REDEMPTION AREA */}
            <div className="p-6 md:p-10 space-y-8">
              
              {/* Ultra-Slim Status Bar */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                   {alreadyRedeemed ? <CheckCircle2 size={16} className="text-orange-600" /> : <Sparkles size={16} className="text-orange-500" />}
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                     {alreadyRedeemed ? 'Verified Claim' : 'Voucher Ready'}
                   </p>
                </div>

                
                <div className="h-[1px] flex-1 mx-4 bg-orange-100/50" />
                <p className="text-[10px] font-bold text-orange-800 uppercase italic">Code Secured</p>
              </div>

               {offer.studentCap > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <p className="text-xs font-bold text-amber-800 text-center">
                  {offer.redemptionCount} of {offer.studentCap} redemptions used
                </p>
                <div className="mt-2 w-full bg-amber-200 rounded-full h-1.5">
                  <div 
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (offer.redemptionCount / offer.studentCap) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}

              {/* REDEEM CLIENT */}
              <RedeemClient
                couponCode={couponCode}
                redirectUrl={offer.redirectUrl}
              />

             

              <p className="text-center text-[8px] font-black text-[#3C1A0D]/20 uppercase tracking-[0.4em]">
                Verified Student Member Exclusive
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}