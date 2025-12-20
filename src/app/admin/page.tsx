import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  CheckCircle, 
  Mail, 
  Building2, 
  LayoutDashboard, 
  Settings, 
  Fingerprint, 
  ChevronRight,
  Search
} from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getSessionUser();

  if (!session) redirect("/admin/login");
  if (session.role !== "ADMIN") redirect("/login");

  const pendingMerchants = await prisma.merchant.findMany({
    where: { kycStatus: "PENDING" },
    include: { user: true },
  });

  return (
    <div className="min-h-screen bg-[#FFF5EE] flex font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-[#3C1A0D] text-white flex flex-col p-8 hidden lg:flex border-r border-orange-900/20">
        <div className="flex items-center gap-3 mb-16 px-2">
          <div className="h-10 w-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/40">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <span className="font-black tracking-tighter text-2xl">
            Admin<span className="text-orange-600">.</span>
          </span>
        </div>

        <nav className="space-y-3 flex-1">
          <Link href="/admin" className="flex items-center justify-between px-5 py-4 bg-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-900/20">
            <span className="flex items-center gap-3"><LayoutDashboard size={18} /> Dashboard</span>
            <ChevronRight size={14} />
          </Link>
          <Link href="merchant/login" className="flex items-center gap-3 px-5 py-4 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
            <Users size={18} /> Merchants
          </Link>
          <Link href="login" className="flex items-center gap-3 px-5 py-4 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
            <Building2 size={18} /> Students
          </Link>
        </nav>

        <div className="p-5 bg-white/5 rounded-[24px] border border-white/5 mt-auto">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Auth Session</p>
          <p className="text-xs font-bold truncate text-orange-100">{session.email}</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-12 overflow-y-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] mb-3">
              <Clock size={14} className="fill-orange-600/20" /> Verification Protocol
            </div>
            <h1 className="text-5xl font-black text-[#3C1A0D] tracking-tighter">Merchant Approval Queue</h1>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white px-8 py-4 rounded-[24px] border border-orange-100 shadow-sm text-center">
                <p className="text-[10px] font-black text-[#3C1A0D]/30 uppercase tracking-[0.2em]">Awaiting Review</p>
                <p className="text-3xl font-black text-[#3C1A0D]">{pendingMerchants.length}</p>
             </div>
          </div>
        </header>

        {/* MERCHANT LIST */}
        <div className="grid gap-6">
          {pendingMerchants.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-xl rounded-[48px] p-24 border-4 border-dashed border-orange-100 flex flex-col items-center justify-center text-center">
                <div className="h-24 w-24 bg-orange-50 rounded-full flex items-center justify-center text-orange-200 mb-8">
                    <CheckCircle size={48} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-black text-[#3C1A0D] tracking-tight">System Optimized</h3>
                <p className="text-[#3C1A0D]/50 font-medium max-w-xs mt-2">All merchant KYC applications have been processed.</p>
            </div>
          ) : (
            pendingMerchants.map((merchant) => (
              <div
                key={merchant.id}
                className="group bg-white rounded-[32px] p-8 border border-orange-50 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(255,120,0,0.1)] transition-all flex flex-col xl:flex-row justify-between items-center gap-8"
              >
                <div className="flex items-center gap-8 w-full">
                  <div className="h-20 w-20 bg-orange-50 rounded-[24px] flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-inner">
                    <Building2 size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-black text-[#3C1A0D] tracking-tight">{merchant.legalName}</h3>
                      <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider border border-orange-100">
                        {merchant.tradeName || "DBA REQUIRED"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3C1A0D]/40 uppercase tracking-widest">
                            <Mail size={14} className="text-orange-400" />
                            {merchant.user.email}
                        </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full xl:w-auto">
                    <button className="flex-1 xl:flex-none px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[#3C1A0D]/40 hover:text-orange-600 hover:bg-orange-50 transition-all">
                        Inspect Docs
                    </button>
                    <form action={`/api/admin/approve-merchant`} method="POST" className="flex-1 xl:flex-none">
                      <input type="hidden" name="merchantId" value={merchant.id} />
                      <button className="w-full px-10 py-4 bg-[#3C1A0D] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-orange-600 shadow-xl shadow-orange-900/10 transition-all active:scale-95">
                        Approve Entity
                      </button>
                    </form>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}