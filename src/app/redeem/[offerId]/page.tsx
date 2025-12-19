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
  Sparkles,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

// Helper function to generate unique coupon code
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

  // Get student record
  const student = await prisma.student.findUnique({
    where: { userId: session.userId },
  });

  if (!student) redirect("/login");

  // Get offer with redemptions and merchant
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { 
      merchant: true,
      redemptions: {
        where: { studentId: student.id },
      },
    },
  });

  if (!offer) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFF] p-6">
        <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4">
          <Info size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 italic tracking-tighter">Offer Not Found</h1>
        <p className="text-slate-500 font-medium mt-2 mb-8 text-center max-w-xs">
          This perk doesn't exist or has been removed.
        </p>
        <Link href="/dashboard" className="text-sm font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </main>
    );
  }

  if (offer.status !== "ACTIVE") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFF] p-6">
        <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4">
          <Info size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 italic tracking-tighter">Offer Unavailable</h1>
        <p className="text-slate-500 font-medium mt-2 mb-8 text-center max-w-xs">
          This perk is currently {offer.status.toLowerCase()}.
        </p>
        <Link href="/dashboard" className="text-sm font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </main>
    );
  }

  // Check if already redeemed
  const existingRedemption = offer.redemptions[0];
  const alreadyRedeemed = !!existingRedemption;
  
  let redemptionId: string;
  let couponCode: string;
  
  // Create redemption if not already exists
  if (!alreadyRedeemed) {
    couponCode = generateCouponCode(offerId, student.id);
    
    // Create redemption record in database
    const redemption = await prisma.$transaction(async (tx) => {
      // Create redemption
      const newRedemption = await tx.redemption.create({
        data: {
          couponCode,
          offerId,
          studentId: student.id,
          method: offer.redemptionType, // "QR", "CODE", or "LINK"
          status: "ISSUED",
          redeemedAt: new Date(),
        },
      });
      
      // Increment redemption count on offer
      await tx.offer.update({
        where: { id: offerId },
        data: {
          redemptionCount: {
            increment: 1,
          },
        },
      });
      
      return newRedemption;
    });
    
    redemptionId = redemption.id;
    couponCode = redemption.couponCode;
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: student.id,
        entity: "REDEMPTION",
        entityId: redemptionId,
        action: "CREATE",
        meta: {
          offerId,
          couponCode,
          method: offer.redemptionType,
        },
      },
    });
  } else {
    redemptionId = existingRedemption.id;
    couponCode = existingRedemption.couponCode;
  }

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
            {alreadyRedeemed && (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-emerald-900 uppercase tracking-wide mb-1">
                    Already Redeemed
                  </p>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    You claimed this offer on {new Date(existingRedemption.redeemedAt).toLocaleDateString()}. Your unique code is displayed below.
                  </p>
                </div>
              </div>
            )}

            {!alreadyRedeemed && (
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-indigo-900 uppercase tracking-wide mb-1">
                    Successfully Claimed!
                  </p>
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    You've successfully claimed this offer. Your unique code has been generated and saved.
                  </p>
                </div>
              </div>
            )}

            {/* Offer availability info */}
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

            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {alreadyRedeemed ? 'Your Code' : 'Unlock Details'}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                     <ShieldCheck size={10} /> {alreadyRedeemed ? 'ISSUED' : 'ACTIVE'}
                  </div>
               </div>
               
               <RedeemClient
                 couponCode={couponCode}
                 redirectUrl={offer.redirectUrl}
                 offerId={offerId}
                 studentId={student.id}
                 alreadyRedeemed={alreadyRedeemed}
                 redemptionMethod={offer.redemptionType}
               />
            </div>

            {/* Redemption details */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Redemption Details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Redemption ID</p>
                  <p className="text-xs font-mono text-slate-700 truncate">{redemptionId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Method</p>
                  <p className="text-xs font-bold text-slate-700">{offer.redemptionType}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Valid Until</p>
                  <p className="text-xs font-medium text-slate-700">
                    {new Date(offer.endAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                  <p className="text-xs font-bold text-emerald-600">
                    {alreadyRedeemed ? 'ISSUED' : 'NEW'}
                  </p>
                </div>
              </div>
            </div>

            {/* TRUST & TERMS FOOTER */}
            <div className="pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <Clock size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">One-time Use</p>
                        <p className="text-[10px] font-medium text-slate-400 leading-tight">Code valid once per student</p>
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