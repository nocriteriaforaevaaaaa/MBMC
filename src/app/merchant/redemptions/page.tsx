import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Users, BarChart3 } from "lucide-react";

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
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-slate-100 pt-12 pb-8 px-10">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/merchant"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Redemption Analytics
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-10 mt-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 border border-slate-100">
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
              <TrendingUp size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900">{totalRedemptions}</p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">
              Total Redemptions
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100">
            <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
              <BarChart3 size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900">
              {merchant.offers.filter(o => o.redemptions.length > 0).length}
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">
              Active Offers
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100">
            <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
              <Users size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900">
              {new Set(merchant.offers.flatMap(o => o.redemptions.map(r => r.studentId))).size}
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">
              Unique Students
            </p>
          </div>
        </div>

        {/* Offers Breakdown */}
        <div className="space-y-6">
          {merchant.offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-3xl p-8 border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{offer.title}</h2>
                  <p className="text-sm text-slate-500 mt-1">{offer.description}</p>
                </div>
                <span className="text-sm font-black px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  {offer.redemptions.length} Redeemed
                </span>
              </div>

              {offer.redemptions.length > 0 ? (
                <div className="space-y-3">
                  {offer.redemptions.map((redemption) => (
                    <div
                      key={redemption.id}
                      className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black text-sm">
                          {redemption.student.user.email?.[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {redemption.student.user.email}
                          </p>
                          <p className="text-xs text-slate-500">
                            Code: <code className="font-mono font-bold">{redemption.couponCode}</code>
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                       
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-slate-400 font-bold py-8">
                  No redemptions yet
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}