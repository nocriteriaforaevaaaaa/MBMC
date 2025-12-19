import Link from "next/link";
import { ShieldCheck, Play, Bell, User, ArrowRight } from "lucide-react";

const previewOffers = [
  {
    id: "1",
    brand: "Foodmandu",
    title: "20% off on first order",
    discount: "20%",
    tag: "Food",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  {
    id: "2",
    brand: "Pathao",
    title: "Flat 15% student discount",
    discount: "15%",
    tag: "Travel",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    id: "3",
    brand: "Daraz",
    title: "Up to 30% off for students",
    discount: "30%",
    tag: "Shopping",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-rose-100 overflow-x-hidden">
      
      {/* LUXURY BACKGROUND BLUR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-200/20 blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full bg-rose-200/20 blur-[120px]" />
      </div>

      {/* HEADER / NAV */}
      <nav className="relative z-50 flex items-center justify-between px-10 py-8 max-w-7xl mx-auto">
        <div className="group cursor-pointer flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <span className="relative font-black text-indigo-600 group-hover:text-white transition-colors">EP</span>
          </div>
          <span className="text-2xl font-black tracking-tighter italic">
            Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Perks</span>
          </span>
        </div>
        
        <div className="flex items-center gap-8">
          <Link href="/login" className="hidden sm:block text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Sign in</Link>
          <Link href="/register" className="px-8 py-3 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
            Join the Club
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-10 pt-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <div>
            <div className="inline-flex items-center gap-3 px-2 py-1 mb-8">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 shadow-sm" />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                <span className="text-slate-900">12,000+</span> Students verified today
              </p>
            </div>

            <h1 className="text-7xl md:text-8xl font-black tracking-tight leading-[0.9] text-slate-900 mb-8">
              Living large on a <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">
                small budget.
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                  <path d="M1 9.5C40 3.5 120 -2.5 299 9.5" stroke="#6366F1" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-lg text-slate-500 max-w-md leading-relaxed mb-10 font-medium">
              Save More. Stress Less. The premium discount layer for students. One ID, hundreds of brands, zero cost to join for life.
            </p>

            <div className="flex items-center gap-4">
              <Link href="/register" className="px-10 py-5 rounded-3xl bg-indigo-600 text-white font-bold text-lg hover:bg-slate-900 shadow-2xl shadow-indigo-100 transition-all hover:-translate-y-1">
                Claim your access
              </Link>
              
            </div>
          </div>

          {/* RIGHT SIDE: THE VERIFIED SHIELD CARD */}
          <div className="hidden lg:block relative group">
            {/* Decorative Stacked Card */}
            <div className="absolute inset-0 bg-indigo-100 rounded-[48px] rotate-6 scale-95 opacity-40 group-hover:rotate-3 transition-transform duration-700" />
            
            {/* Main White Card */}
            <div className="relative bg-white p-10 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center">
              
              {/* Top Row */}
              <div className="w-full flex justify-between items-center mb-10">
                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <User size={18} />
                </div>
                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <Bell size={18} />
                </div>
              </div>

              {/* The Shield Component */}
              <div className="relative mb-8 group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-10 animate-pulse" />
                <div className="relative h-32 w-28 bg-slate-900 rounded-b-[3.5rem] rounded-t-xl flex flex-col items-center justify-center text-white shadow-2xl">
                  <ShieldCheck size={40} className="text-indigo-400 mb-2" strokeWidth={2.5} />
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none text-indigo-200">Verified</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Student</p>
                  </div>
                </div>
              </div>

              {/* Card Meta */}
              <div className="text-center mb-10">
                <h3 className="text-2xl font-black text-slate-900 mb-1">Status: Active</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Academic Year 24/25</p>
              </div>

              {/* Link Action */}
              <button className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs tracking-[0.2em] uppercase shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-colors">
                Link the Club
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* OFFERS GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-10 pb-32">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Live Perks Feed</h2>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewOffers.map((offer) => (
            <div key={offer.id} className="group bg-white rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
              
              {/* Image Header */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.brand} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Image Overlays */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div>
                    <span className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase border border-white/20 mb-2 block w-fit">
                      {offer.tag}
                    </span>
                    <h4 className="text-4xl font-black text-white tracking-tighter">
                      {offer.discount} <span className="text-lg">OFF</span>
                    </h4>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{offer.brand}</h3>
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                </div>
                <p className="text-sm text-slate-500 font-medium mb-6">{offer.title}</p>
                <button className="w-full py-4 rounded-2xl bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white transition-all">
                  Sign In To Unlock
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-10 py-16 bg-white border-t border-slate-100 text-center">
        <span className="text-2xl font-black italic block mb-4">EduPerks</span>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified Institutional Email Required</p>
      </footer>
    </main>
  );
}