import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Users, BarChart3, ChevronLeft, Ticket } from "lucide-react";

export default async function MerchantRedemptionsPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "MERCHANT") redirect("/login");

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.userId },
    include: {
      offers: {
        include: {
          redemptions: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
            orderBy: { redeemedAt: "desc" },
          },
        },
      },
    },
  });

  if (!merchant) redirect("/login");

  const totalRedemptions = merchant.offers.reduce(
    (sum, offer) => sum + offer.redemptions.length,
    0
  );

  return (
    <main className="min-h-screen bg-[#FFF5EE] text-[#3C1A0D] pb-20 font-sans">
      {/* HEADER AREA */}
      <div className="bg-white/50 backdrop-blur-md border-b border-orange-100 pt-16 pb-10 px-10">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/merchant"
            className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#3C1A0D]/40 hover:text-orange-600 transition-all mb-8"
          >
            <div className="h-8 w-8 rounded-full border border-orange-100 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
               <ChevronLeft size={16} />
            </div>
            Back to Hub
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-[0.25em] mb-3">
                    <BarChart3 size={14} /> Performance Metrics
                </div>
                <h1 className="text-5xl font-black tracking-tighter">
                    Redemption Analytics<span className="text-orange-600">.</span>
                </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-10 mt-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-[32px] p-8 border border-orange-50 shadow-sm">
            <div className="h-14 w-14 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 mb-6">
              <TrendingUp size={28} />
            </div>
            <p className="text-4xl font-black tracking-tighter">{totalRedemptions}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3C1A0D]/30 mt-2">
              Gross Redemptions
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-orange-50 shadow-sm">
            <div className="h-14 w-14 bg-[#3C1A0D] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/10 mb-6">
              <Ticket size={28} />
            </div>
            <p className="text-4xl font-black tracking-tighter">
              {merchant.offers.filter(o => o.redemptions.length > 0).length}
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3C1A0D]/30 mt-2">
              Converting Offers
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-orange-50 shadow-sm">
            <div className="h-14 w-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <Users size={28} />
            </div>
            <p className="text-4xl font-black tracking-tighter">
              {new Set(merchant.offers.flatMap(o => o.redemptions.map(r => r.studentId))).size}
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3C1A0D]/30 mt-2">
              Unique Reach
            </p>
          </div>
        </div>

        {/* Offers Breakdown */}
        <div className="space-y-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3C1A0D]/40 px-2">Campaign Breakdown</h2>
          
          {merchant.offers.map((offer) => (
            <div key={offer.id} className="bg-white/80 backdrop-blur-xl rounded-[48px] p-10 shadow-[0_32px_64px_-16px_rgba(255,120,0,0.05)] border border-white">
              <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{offer.title}</h2>
                  <p className="text-sm font-medium text-[#3C1A0D]/50 mt-2 max-w-xl">{offer.description}</p>
                </div>
                <div className="px-6 py-3 bg-orange-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-200">
                  {offer.redemptions.length} Conversions
                </div>
              </div>

              {offer.redemptions.length > 0 ? (
                <div className="grid gap-4">
                  {offer.redemptions.map((redemption) => (
                    <div
                      key={redemption.id}
                      className="flex flex-col md:flex-row justify-between items-center p-6 bg-orange-50/50 rounded-[24px] border border-orange-100/50 group hover:bg-white hover:border-orange-200 transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 bg-[#3C1A0D] rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md">
                          {redemption.student.user.email?.[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-[#3C1A0D] tracking-tight">
                            {redemption.student.user.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] font-black uppercase tracking-widest text-[#3C1A0D]/30">Voucher Key:</span>
                             <code className="bg-white px-2 py-0.5 rounded border border-orange-100 text-[11px] font-mono font-bold text-orange-600">
                                {redemption.couponCode}
                             </code>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                         <p className="text-[9px] font-black uppercase tracking-widest text-[#3C1A0D]/20">Timestamp</p>
                         <p className="text-[11px] font-bold text-[#3C1A0D]/60 italic">
                            {new Date(redemption.redeemedAt).toLocaleDateString()}
                         </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 border-2 border-dashed border-orange-100 rounded-[32px] flex flex-col items-center justify-center">
                    <p className="text-[10px] font-black text-[#3C1A0D]/20 uppercase tracking-[0.2em]">
                        Data Stream Empty
                    </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}