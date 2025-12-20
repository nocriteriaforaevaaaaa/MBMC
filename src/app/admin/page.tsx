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
  ChevronRight,
  FileText,
  ExternalLink,
  Image as ImageIcon,
  Fingerprint,
  XCircle
} from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getSessionUser();

  if (!session) redirect("/admin/login");
  if (session.role !== "ADMIN") redirect("/login");

  const pendingMerchants = await prisma.merchant.findMany({
    where: { kycStatus: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
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
          <Link href="/merchant/login" className="flex items-center gap-3 px-5 py-4 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
            <Users size={18} /> Merchants
          </Link>
          <Link href="/login" className="flex items-center gap-3 px-5 py-4 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
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
                className="group bg-white rounded-[32px] p-8 border border-orange-50 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(255,120,0,0.1)] transition-all"
              >
                {/* MERCHANT HEADER */}
                <div className="flex items-start gap-6 mb-6">
                  <div className="h-20 w-20 bg-orange-50 rounded-[24px] flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-inner flex-shrink-0">
                    <Building2 size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-black text-[#3C1A0D] tracking-tight">{merchant.legalName}</h3>
                      {merchant.tradeName && (
                        <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider border border-orange-100">
                          {merchant.tradeName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3C1A0D]/40 uppercase tracking-widest">
                            <Mail size={14} className="text-orange-400" />
                            <span className="truncate">{merchant.user.email}</span>
                        </div>
                        {merchant.pan && (
                          <div className="flex items-center gap-1.5 text-xs font-black text-[#3C1A0D]/40 uppercase tracking-widest">
                            <Fingerprint size={14} className="text-orange-400" />
                            {merchant.pan}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* PAN CARD PREVIEW SECTION */}
                {merchant.panCardUrl ? (
                  <div className="mb-6 p-6 bg-gradient-to-br from-orange-50/80 to-orange-50/40 rounded-[24px] border border-orange-100/50">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText size={16} className="text-orange-600" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3C1A0D]/60">
                        PAN Card Document Submitted
                      </span>
                    </div>
                    
                    {merchant.panCardUrl.toLowerCase().endsWith('.pdf') ? (
                      // PDF DISPLAY
                      <a 
                        href={merchant.panCardUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all group/pdf"
                      >
                        <div className="h-14 w-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText size={24} className="text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-[#3C1A0D] mb-1">PAN Card - PDF Document</p>
                          <p className="text-[10px] font-bold text-[#3C1A0D]/40 uppercase tracking-wider">Click to open in new tab</p>
                        </div>
                        <ExternalLink size={20} className="text-orange-400 group-hover/pdf:translate-x-1 group-hover/pdf:-translate-y-1 transition-transform flex-shrink-0" />
                      </a>
                    ) : (
                      // IMAGE DISPLAY
                      <a 
                        href={merchant.panCardUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block relative overflow-hidden rounded-2xl border-2 border-orange-200 hover:border-orange-400 transition-all group/img"
                      >
                        <div className="bg-white p-4">
                          <img 
                            src={merchant.panCardUrl} 
                            alt="PAN Card"
                            className="w-full h-auto max-h-[400px] object-contain rounded-xl"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-center pb-8">
                          <div className="flex items-center gap-2 text-white text-xs font-black uppercase tracking-wider bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                            <ImageIcon size={16} />
                            Click to view full size
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                ) : (
                  // NO DOCUMENT WARNING
                  <div className="mb-6 p-6 bg-red-50/50 rounded-[24px] border border-red-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <XCircle size={20} className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-red-900 uppercase tracking-wider">No PAN Card Uploaded</p>
                        <p className="text-[10px] font-medium text-red-600 mt-0.5">Merchant did not submit verification documents</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3 w-full pt-4 border-t border-orange-100">
                    {merchant.panCardUrl && (
                      <a 
                        href={merchant.panCardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[#3C1A0D]/40 hover:text-orange-600 hover:bg-orange-50 border border-orange-100 hover:border-orange-200 transition-all"
                      >
                        <ExternalLink size={14} />
                        View Full Doc
                      </a>
                    )}
                    
                    {/* REJECT BUTTON
                    <form action={`/api/admin/reject-merchant`} method="POST" className="flex-1">
                      <input type="hidden" name="merchantId" value={merchant.id} />
                      <button 
                        type="submit"
                        className="w-full px-8 py-4 bg-white border-2 border-red-200 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-50 hover:border-red-300 transition-all active:scale-95"
                      >
                        Reject
                      </button>
                    </form> */}

                    {/* APPROVE BUTTON */}
                    <form action={`/api/admin/approve-merchant`} method="POST" className="flex-1">
                      <input type="hidden" name="merchantId" value={merchant.id} />
                      <button 
                        type="submit"
                        className="w-full px-10 py-4 bg-[#3C1A0D] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-orange-600 shadow-xl shadow-orange-900/10 transition-all active:scale-95"
                      >
                        ✓ Approve Entity
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