import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Store, 
  Plus, 
  Clock, 
  History, 
  ArrowUpRight, 
  AlertCircle,
  LayoutGrid,
  Zap,
  ChevronRight,
  LayoutDashboard,
  Settings
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

  // --- 1. SHARED SIDEBAR COMPONENT ---
  const Sidebar = () => (
    <aside className="w-72 bg-[#3C1A0D] text-white flex flex-col p-8 hidden lg:flex border-r border-orange-900/20 sticky top-0 h-screen">
      <div className="flex items-center gap-3 mb-16 px-2">
        <div className="h-10 w-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/40">
          <Store size={22} className="text-white" />
        </div>
        <span className="font-black tracking-tighter text-2xl">
          Partner<span className="text-orange-600">.</span>
        </span>
      </div>

      <nav className="space-y-3 flex-1">
        <Link href="/merchant" className="flex items-center justify-between px-5 py-4 bg-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-900/20">
          <span className="flex items-center gap-3"><LayoutDashboard size={18} /> Merchant Dashboard</span>
          <ChevronRight size={14} />
        </Link>
        <Link href="/login" className="flex items-center gap-3 px-5 py-4 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
          <History size={18} /> Students
        </Link>
        <Link href="#" className="flex items-center gap-3 px-5 py-4 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
          <Settings size={18} /> Settings
        </Link>
      </nav>

      <div className="p-5 bg-white/5 rounded-[24px] border border-white/5 mt-auto">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Merchant Account</p>
        <p className="text-xs font-bold truncate text-orange-100">{merchant.tradeName || merchant.legalName}</p>
      </div>
    </aside>
  );

  // --- 2. PENDING APPROVAL UI ---
  if (merchant.kycStatus !== "APPROVED") {
    return (
      <div className="min-h-screen bg-[#FFF5EE] flex font-sans">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-200/20 blur-[120px] pointer-events-none" />
          <div className="relative bg-white/80 backdrop-blur-2xl p-16 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(255,120,0,0.1)] border border-white max-w-xl text-center">
            <div className="h-24 w-24 bg-orange-100 rounded-[32px] flex items-center justify-center text-orange-600 mx-auto mb-10 shadow-inner">
              <Clock size={48} strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-black text-[#3C1A0D] mb-4 tracking-tighter">Review in Progress</h1>
            <p className="text-[#3C1A0D]/60 font-medium leading-relaxed mb-10 text-lg">
              Our verification engine is currently auditing your business documents. You'll unlock offer publishing shortly.
            </p>
            <div className="p-6 bg-[#3C1A0D] rounded-3xl flex items-center gap-5 text-left shadow-xl shadow-orange-900/20">
              <AlertCircle size={28} className="text-orange-500 shrink-0" />
              <div>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] leading-tight mb-1">
                  Est. Completion
                </p>
                <p className="text-lg text-white font-bold tracking-tight">Under 24 Hours</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- 3. APPROVED MERCHANT DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#FFF5EE] flex font-sans text-[#3C1A0D]">
      <Sidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        {/* HEADER AREA */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] mb-3">
              <Zap size={14} className="fill-orange-600/20" /> Partner Control Center
            </div>
            <h1 className="text-5xl font-black text-[#3C1A0D] tracking-tighter uppercase italic">
              {merchant.tradeName || merchant.legalName}<span className="text-orange-600">.</span>
            </h1>
          </div>
          <Link 
            href="/merchant/redemptions"
            className="group px-10 py-5 rounded-2xl bg-[#3C1A0D] text-white text-[10px] font-black uppercase tracking-[0.25em] hover:bg-orange-600 transition-all flex items-center gap-3 shadow-xl shadow-orange-900/10 active:scale-95"
          >
            <History size={16} /> Analytics Hub <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN: FORM */}
          <section className="lg:col-span-7">
            <div className="bg-white/80 backdrop-blur-xl rounded-[48px] p-12 shadow-[0_32px_64px_-16px_rgba(255,120,0,0.05)] border border-white">
              <div className="flex items-center gap-5 mb-12">
                <div className="h-14 w-14 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                  <Plus size={28} strokeWidth={3} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[#3C1A0D] tracking-tighter">Deploy Offer</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3C1A0D]/30">Network Expansion Phase</p>
                </div>
              </div>

              <form action="/api/merchant/offers" method="POST" className="space-y-10">
                <Input name="title" label="Offer Headline" placeholder="e.g. 20% Student Discount" required />
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3C1A0D]/40 ml-2">Internal Brief (Description)</label>
                  <textarea
                    name="description"
                    placeholder="Tell students what they get and how to redeem it..."
                    required
                    className="w-full bg-white border border-orange-100 rounded-[24px] px-6 py-5 text-sm font-bold text-[#3C1A0D] focus:outline-none focus:ring-8 focus:ring-orange-500/5 focus:border-orange-500 transition-all placeholder:text-[#3C1A0D]/20 min-h-[140px] shadow-sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3C1A0D]/40 ml-2">Market Category</label>
                    <select name="category" required className="w-full bg-white border border-orange-100 rounded-[24px] px-6 py-5 text-sm font-bold text-[#3C1A0D] focus:outline-none focus:ring-8 focus:ring-orange-500/5 focus:border-orange-500 transition-all appearance-none cursor-pointer shadow-sm">
                      <option value="">Select Category...</option>
                      <option value="FOOD">Food & Drink</option>
                      <option value="FASHION">Fashion</option>
                      <option value="TECH">Technology</option>
                      <option value="EDUCATION">Education</option>
                      <option value="LIFESTYLE">Lifestyle</option>
                    </select>
                  </div>
                  <Input name="discountPercent" type="number" label="Discount Margin %" placeholder="20" required />
                </div>

                <Input name="redirectUrl" label="Redirection Endpoint (URL)" placeholder="https://yourstore.com" required />

                <button className="w-full py-6 rounded-[24px] bg-[#3C1A0D] text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-orange-900/20 hover:bg-orange-600 hover:-translate-y-1 transition-all active:scale-95">
                  Authorize & Push Live
                </button>
              </form>
            </div>
          </section>

          {/* RIGHT COLUMN: LIVE INVENTORY */}
          <section className="lg:col-span-5 space-y-10">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3C1A0D]/30 flex items-center gap-3">
                <LayoutGrid size={18} /> Active Inventory
              </h2>
              <span className="text-[9px] font-black px-4 py-1.5 bg-orange-600 rounded-full text-white shadow-lg shadow-orange-200">
                {merchant.offers.length} DEPLOYED
              </span>
            </div>

            <div className="space-y-6">
              {merchant.offers.length === 0 ? (
                <div className="bg-white/40 border-4 border-dashed border-orange-100 rounded-[48px] p-20 text-center">
                  <div className="h-20 w-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Store className="text-orange-200" size={40} />
                  </div>
                  <p className="text-[10px] font-black text-[#3C1A0D]/30 uppercase tracking-[0.2em] leading-relaxed">
                    Zero perks currently <br /> live in the network
                  </p>
                </div>
              ) : (
                merchant.offers.map((offer) => (
                  <div key={offer.id} className="group bg-white border border-orange-50 p-8 rounded-[40px] hover:shadow-[0_40px_80px_-20px_rgba(255,120,0,0.15)] hover:border-orange-200 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-6">
                    </div>
                    <h3 className="text-2xl font-black text-[#3C1A0D] group-hover:text-orange-600 transition-colors tracking-tighter">
                      {offer.title}
                    </h3>
                    <p className="text-sm font-medium text-[#3C1A0D]/50 line-clamp-2 mt-3 leading-relaxed">
                      {offer.description}
                    </p>
                    <div className="mt-8 pt-6 border-t border-orange-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                         <span className="text-[10px] font-black text-[#3C1A0D]/40 uppercase tracking-[0.2em]">{offer.category}</span>
                      </div>
                      <span className="text-[10px] font-bold text-orange-400 italic truncate max-w-[160px]">
                        {offer.redirectUrl.replace('https://', '')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}