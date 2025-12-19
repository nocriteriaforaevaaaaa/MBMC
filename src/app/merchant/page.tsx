import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Store, 
  Plus, 
  Tag, 
  Globe, 
  Percent, 
  Clock, 
  History, 
  ArrowUpRight, 
  AlertCircle,
  LayoutGrid
} from "lucide-react";
import Input from "@/app/components/Input";
import Link from "next/link";

export default async function MerchantPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "MERCHANT") redirect("/login");

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.userId },
    include: {
      offers: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!merchant) redirect("/login");

  // --- 1. PENDING APPROVAL UI ---
  if (merchant.kycStatus !== "APPROVED") {
    return (
      <main className="min-h-screen bg-[#FDFDFF] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-indigo-50/50 pointer-events-none" />
        <div className="relative bg-white p-10 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 max-w-md text-center">
          <div className="h-20 w-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mx-auto mb-6">
            <Clock size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Review in Progress</h1>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            Our team is currently verifying your business details. You'll be able to publish offers as soon as you're approved.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3 text-left">
            <AlertCircle size={20} className="text-slate-400 shrink-0" />
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-tight">
              Average review time: <span className="text-slate-900">24 Hours</span>
            </p>
          </div>
        </div>
      </main>
    );
  }

  // --- 2. APPROVED MERCHANT DASHBOARD ---
  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* HEADER AREA */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-8 px-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              <Store size={14} /> Official Partner Dashboard
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              {merchant.tradeName || merchant.legalName}
            </h1>
          </div>
          <Link 
            href="/merchant/redemptions"
            className="px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2"
          >
            <History size={16} /> View Redemptions
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-10 mt-12 grid lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: FORM */}
        <section className="lg:col-span-7">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Plus size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Create New Offer</h2>
            </div>

            <form action="/api/merchant/offers" method="POST" className="space-y-6">
              <Input name="title" label="Offer Title" placeholder="e.g. 20% Student Discount" required />
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                <textarea
                  name="description"
                  placeholder="Tell students what they get and how to redeem it..."
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input name="category" label="Category" placeholder="e.g. Food" icon={<Tag size={16}/>} required />
                <Input name="discountPercent" type="number" label="Discount %" placeholder="20" icon={<Percent size={16}/>} required />
              </div>

              <Input name="redirectUrl" label="Redirection URL" placeholder="https://yourstore.com" icon={<Globe size={16}/>} required />

              <button className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-slate-900 hover:-translate-y-0.5 transition-all">
                Publish Live Offer
              </button>
            </form>
          </div>
        </section>

        {/* RIGHT COLUMN: RECENT LIST */}
        <section className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <LayoutGrid size={16} /> Active Perks
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 bg-slate-200 rounded text-slate-600">
              {merchant.offers.length} TOTAL
            </span>
          </div>

          <div className="space-y-4">
            {merchant.offers.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-12 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  No offers <br /> published yet
                </p>
              </div>
            ) : (
              merchant.offers.map((offer) => (
                <div key={offer.id} className="group bg-white border border-slate-100 p-5 rounded-2xl hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded uppercase tracking-wider">
                      {offer.discountPercent}% OFF
                    </span>
                    <ArrowUpRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{offer.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{offer.description}</p>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{offer.category}</span>
                    <span className="text-[10px] text-slate-300 font-medium truncate max-w-[120px]">
                      {offer.redirectUrl}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}