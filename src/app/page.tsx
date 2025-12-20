import Link from "next/link";
import { ShieldCheck, Bell, User, ArrowRight, Sparkles } from "lucide-react";

const previewOffers = [
  {
    id: "1",
    brand: "Foodmandu",
    title: "20% off on first order",
    discount: "20%",
    tag: "Food",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop"  },
  {
    id: "2",
    brand: "Pathao",
    title: "Flat 15% student discount",
    discount: "15%",
    tag: "Travel",
    image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=800&auto=format&fit=crop"},
  {
    id: "3",
    brand: "Daraz",
    title: "Up to 30% off for students",
    discount: "30%",
    tag: "Shopping",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800&auto=format&fit=crop",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF5EE] text-[#3C1A0D] selection:bg-orange-200 overflow-x-hidden font-sans">
      
      {/* PEACH GRADIENT BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full bg-orange-200/40 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-orange-300/20 blur-[120px]" />
        {/* Large Decorative 'B' or Shape from the image */}
        <div className="absolute top-10 -right-20 text-[20rem] font-black text-orange-600/5 leading-none select-none">EduPERKS</div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-[#3C1A0D]">
            EduPerks<span className="text-orange-600">.</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-[#3C1A0D]/60 hover:text-orange-600 transition-colors">Sign in</Link>
          <Link href="/register" className="px-6 py-3 rounded-2xl bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 active:scale-95">
            Join the Club
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 bg-orange-100/50 rounded-full border border-orange-200/50">
              <Sparkles size={14} className="text-orange-600" />
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-800">
                Over 12k students verified
              </p>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-[#3C1A0D] mb-8">
              Living large <br />
              <span className="text-orange-600">on a small</span> <br />
              budget.
            </h1>
            
            <p className="text-lg text-[#3C1A0D]/70 max-w-md leading-snug mb-10 font-medium">
              The premium discount layer for students. One ID, hundreds of brands, zero cost to join.
            </p>

            <Link href="/register" className="inline-block px-10 py-5 rounded-2xl bg-[#3C1A0D] text-white font-bold text-lg hover:bg-orange-600 shadow-xl transition-all hover:-translate-y-1">
              Start Saving Now
            </Link>
          </div>

          {/* THE "FLOATING FORM" CARD - Matching the image style */}
          <div className="hidden lg:block relative">
            <div className="relative bg-white/80 backdrop-blur-2xl p-8 rounded-[40px] shadow-[0_40px_80px_-15px_rgba(255,120,0,0.15)] border border-white flex flex-col max-w-[440px] mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-xl">Student Pass</h3>
                <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600"><User size={16}/></div>
                    <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600"><Bell size={16}/></div>
                </div>
              </div>

              {/* Verified Shield UI */}
              <div className="bg-orange-600 rounded-3xl p-8 text-white flex flex-col items-center mb-6 shadow-orange-200 shadow-2xl">
                <ShieldCheck size={48} className="mb-4 text-orange-200" strokeWidth={2.5} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Membership Status</p>
                <p className="text-2xl font-black italic">VERIFIED ACTIVE</p>
              </div>

              <div className="space-y-4">
                <div className="h-12 w-full bg-orange-50 rounded-xl border border-orange-100 flex items-center px-4 text-sm font-bold text-[#3C1A0D]/40">
                    Aeva Acharya
                </div>
                <button className="w-full py-4 rounded-xl bg-[#3C1A0D] text-white font-black text-xs tracking-widest uppercase">
                  This can be you!!
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-32">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#3C1A0D]/40">Today's Hot Deals</h2>
          <div className="h-[2px] flex-1 bg-orange-200/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewOffers.map((offer) => (
            <div key={offer.id} className="group bg-white/60 backdrop-blur-sm rounded-[32px] border border-white p-4 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl">
              <div className="relative aspect-square rounded-[24px] overflow-hidden mb-6">
                <img src={offer.image} alt={offer.brand} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-black text-orange-600 uppercase tracking-tighter">
                      {offer.tag}
                    </span>
                </div>
              </div>

              <div className="px-2 pb-2">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-2xl font-black tracking-tight">{offer.brand}</h3>
                  <p className="text-orange-600 font-black text-xl">{offer.discount}</p>
                </div>
                <p className="text-sm text-[#3C1A0D]/60 font-medium mb-6">{offer.title}</p>
                <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                  Sign In To Claim Perk <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-16 bg-[#3C1A0D] text-orange-100/50 text-center">
        <span className="text-2xl font-black italic block mb-2 text-white">EduPerks.</span>
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Created by Students for Students © 2025</p>
      </footer>
    </main>
  );
}