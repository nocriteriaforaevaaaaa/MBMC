import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Store,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  MapPin,
  ChevronRight,
  Search,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const offers = await prisma.offer.findMany({
    where: { status: "ACTIVE", merchant: { kycStatus: "APPROVED" } },
    include: { merchant: true },
  });

  const featuredOffer = offers.length > 0 
    ? offers.reduce((prev, curr) => prev.discountPercent > curr.discountPercent ? prev : curr)
    : null;

  return (
    <main className="min-h-screen bg-[#FFFBF9] text-[#43281C] pb-20 font-sans selection:bg-orange-200">
      {/* 1. SOFT NAV BAR */}
      <nav className="sticky top-0 z-50 bg-[#FFFBF9]/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-orange-500 p-1.5 rounded-xl group-hover:rotate-12 transition-transform">
              <ShieldCheck className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-orange-600 to-peach-500 bg-clip-text">
              EduPerks.
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-orange-50/50 border border-orange-100 px-3 py-1.5 rounded-2xl">
               <Search size={14} className="text-orange-400 mr-2" />
               <input type="text" placeholder="Search brands..." className="bg-transparent text-xs outline-none placeholder:text-orange-300 w-32" />
            </div>
            <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-2xl shadow-sm border border-orange-100">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-orange-400 to-peach-500 text-[11px] text-white flex items-center justify-center font-bold shadow-orange-200 shadow-md">
                {session.name?.charAt(0)}
              </div>
              <span className="text-xs font-bold text-orange-900/80 pr-1">{session.name?.split(" ")[0]}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* 2. DYNAMIC HERO SECTION */}
        {featuredOffer && (
          <section className="relative overflow-hidden rounded-[2.5rem] bg-[#3C1A0D] p-1 shadow-2xl shadow-orange-900/20">
            {/* Background Accent Flairs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[80px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-peach-300/10 blur-[80px] -ml-32 -mb-32" />

            <div className="relative z-10 bg-gradient-to-br from-orange-600/10 to-transparent rounded-[2.3rem] p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
                  <Sparkles size={12} className="fill-orange-300" /> Deal of the week
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-6">
                  Save <span className="text-orange-400">{featuredOffer.discountPercent}%</span> at <br />
                  <span className="underline decoration-orange-500/30 underline-offset-8">{featuredOffer.merchant.tradeName}</span>
                </h2>
                <Link
                  href={`/redeem/${featuredOffer.id}`}
                  className="inline-flex items-center gap-3 bg-white text-orange-700 px-6 py-3 rounded-2xl font-black text-sm hover:bg-orange-50 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
                >
                  Claim My Voucher <ArrowRight size={18} />
                </Link>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-orange-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-white/10 border border-white/20 backdrop-blur-xl rounded-[2rem] p-10 flex flex-col items-center justify-center min-w-[200px] rotate-3 hover:rotate-0 transition-transform duration-500">
                  <span className="text-6xl font-black text-orange-400 tracking-tighter">{featuredOffer.discountPercent}%</span>
                  <span className="text-xs font-bold text-orange-100 uppercase tracking-widest mt-2">Discount</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. CATEGORY BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 my-12">
          <div>
            <h3 className="text-2xl font-black text-[#3C1A0D] flex items-center gap-3">
              <TrendingUp className="text-orange-500" strokeWidth={3} />
              Fresh Perks
            </h3>
            <p className="text-orange-900/50 text-sm font-medium">Handpicked discounts just for you.</p>
          </div>
          
          <div className="flex gap-2 bg-orange-100/40 p-1.5 rounded-[1.25rem] border border-orange-100 w-fit">
            {["All Perks", "Food", "Lifestyle", "Tech"].map((filter, i) => (
              <button 
                key={filter} 
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                  i === 0 
                  ? 'bg-white text-orange-600 shadow-sm border border-orange-100' 
                  : 'text-orange-900/50 hover:bg-orange-100/50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 4. THE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <Link
              key={offer.id}
              href={`/redeem/${offer.id}`}
              className="group relative bg-white border border-orange-100 rounded-[2rem] p-5 hover:shadow-[0_20px_50px_rgba(255,125,50,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-200">
                  <Store size={24} strokeWidth={2} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[11px] font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                    {offer.discountPercent}% Off
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col flex-1">
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1.5">
                  {offer.merchant.tradeName}
                </p>
                <h4 className="font-bold text-base text-[#3C1A0D] line-clamp-2 leading-snug mb-4 group-hover:text-orange-600 transition-colors">
                  {offer.title}
                </h4>
{offer.imageUrl && (
  <img
    src={offer.imageUrl}
    alt={offer.title}
    className="w-full h-40 object-contain rounded-xl mt-3"
  />
)}

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-orange-50">
                  <div className="flex items-center gap-1.5 text-orange-900/40">
                    <Zap size={14} className="fill-orange-200 text-orange-300" />
                    <span className="text-[11px] font-black uppercase tracking-tight">Instant Redeem</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <ChevronRight size={16} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 5. EMPTY STATE */}
        {offers.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-orange-100 rounded-[3rem] bg-orange-50/20">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Sparkles className="text-orange-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-orange-900/60">Restocking the shelves...</h3>
            <p className="text-sm text-orange-900/40 mt-1">New exclusive deals are arriving shortly.</p>
          </div>
        )}
      </div>
    </main>
  );
}