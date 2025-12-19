import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Percent, 
  Store, 
  TrendingUp, 
  Calendar, 
  Tag, 
  ArrowRight, 
  Sparkles,
  Ticket,
  Zap,
  ShoppingBag,
  Search,
  MapPin
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const offers = await prisma.offer.findMany({
    where: { status: "ACTIVE", merchant: { kycStatus: "APPROVED" } },
    include: { merchant: true },
  });

  // Calculate Featured Offer (Highest Discount)
  const featuredOffer = offers.length > 0 
    ? offers.reduce((prev, current) => (prev.discountPercent > current.discountPercent) ? prev : current)
    : null;

  return (
    <main className="min-h-screen bg-[#FDFDFF] text-slate-900 pb-20 relative overflow-hidden">
      {/* LUXURY BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-50/40 via-white to-transparent pointer-events-none" />
      <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-100/30 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rose-100/20 blur-[100px] pointer-events-none" />

      {/* NAVIGATION BAR */}
      <nav className="relative z-30 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-white font-black italic text-sm">EP</span>
          </div>
          <span className="text-2xl font-black tracking-tighter italic">Edu<span className="text-indigo-600">Perks</span></span>
        </Link>
        
        <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Member</p>
                <p className="text-sm font-bold text-slate-700">{session.email}</p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-indigo-600">
                {session.email?.charAt(0).toUpperCase()}
            </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 relative z-20">
        
        {/* HERO FEATURED SECTION */}
        {featuredOffer && (
          <section className="mb-20 mt-6">
            <div className="relative overflow-hidden rounded-[48px] bg-slate-900 p-8 md:p-16 text-white shadow-2xl shadow-indigo-200/50">
              {/* Dynamic Overlay */}
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-600/30 via-transparent to-transparent" />
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <span className="bg-rose-500 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center gap-2">
                            <Sparkles size={12} fill="white" /> Spotlight Deal
                        </span>
                        <div className="h-[1px] w-12 bg-white/20" />
                    </div>
                    
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-[0.9] mb-6">
                        Save <span className="text-indigo-400">{featuredOffer.discountPercent}%</span> <br /> 
                        at {featuredOffer.merchant.tradeName}
                    </h2>
                    
                    <p className="text-slate-400 text-lg md:text-xl font-medium mb-10 max-w-md leading-relaxed">
                        {featuredOffer.title}
                    </p>
                    
                    <Link 
                        href={`/redeem/${featuredOffer.id}`}
                        className="group inline-flex items-center gap-4 bg-white text-slate-900 px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all hover:gap-6"
                    >
                        Claim Access <ArrowRight size={20} className="text-indigo-600" />
                    </Link>
                </div>

                <div className="hidden lg:flex justify-center relative">
                    <div className="h-80 w-80 bg-white/5 rounded-[60px] backdrop-blur-3xl border border-white/10 flex items-center justify-center rotate-3 group">
                         <div className="text-center">
                            <ShoppingBag size={80} className="text-indigo-400/50 mb-4 mx-auto" />
                            <p className="text-4xl font-black italic tracking-tighter">{featuredOffer.merchant.tradeName?.split(' ')[0]}</p>
                         </div>
                    </div>
                    {/* Abstract Ring */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <TrendingUp size={24} />
             </div>
             <div>
                <h3 className="text-2xl font-black tracking-tight italic">All <span className="text-indigo-600">Discounts</span></h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{offers.length} Verified Perks Available</p>
             </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 backdrop-blur-md rounded-[24px] border border-slate-200/50 w-full lg:w-auto">
              {['Trending', 'Food', 'Tech', 'Fashion'].map((filter, i) => (
                <button key={filter} className={`flex-1 lg:flex-none px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    {filter}
                </button>
              ))}
          </div>
        </div>

        {/* OFFERS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {offers.map((offer) => (
            <Link 
              key={offer.id} 
              href={`/redeem/${offer.id}`}
              className="group flex flex-col bg-white border border-slate-100 rounded-[40px] overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2"
            >
              {/* Card Header (Branding) */}
              <div className="h-40 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-rose-50/50" />
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                        {offer.category || "Exclusive"}
                    </span>
                  </div>

                  <span className="relative text-5xl font-black text-slate-200 italic uppercase tracking-tighter group-hover:scale-110 transition-transform duration-700">
                    {offer.merchant.tradeName?.split(' ')[0]}
                  </span>

                  <div className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow-xl shadow-indigo-200">
                     <p className="text-xs font-black italic">{offer.discountPercent}% OFF</p>
                  </div>
              </div>

              {/* Card Body */}
              <div className="p-8 flex flex-col flex-1">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Store size={12} className="text-indigo-400" />
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        {offer.merchant.tradeName || offer.merchant.legalName}
                    </p>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 leading-[1.2] tracking-tight group-hover:text-indigo-600 transition-colors">
                    {offer.title}
                  </h4>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Zap size={14} className="text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Instant Access</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <MapPin size={12} />
                            <span className="text-[10px] font-bold uppercase">Online</span>
                        </div>
                    </div>
                   
                    <div className="w-full py-4 rounded-[20px] bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all text-center text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                      Get Coupon Code <ArrowRight size={14} />
                    </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* EMPTY STATE */}
        {offers.length === 0 && (
            <div className="py-20 text-center">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                    <Search size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900 italic">No deals found... yet!</h3>
                <p className="text-slate-500 font-medium">Check back soon for new student exclusive perks.</p>
            </div>
        )}
      </div>
    </main>
  );
}