import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShieldCheck, Users, Clock, CheckCircle, Mail, Building2, LayoutDashboard, Settings } from "lucide-react";
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
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 hidden lg:flex">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="font-black tracking-tighter text-xl italic">Admin<span className="text-indigo-400">Panel</span></span>
        </div>

        <nav className="space-y-2 flex-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-indigo-600 rounded-xl text-sm font-bold transition-all">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-bold transition-all">
            <Users size={18} /> Merchants
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-bold transition-all">
            <Settings size={18} /> System Settings
          </Link>
        </nav>

        <div className="p-4 bg-slate-800 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Logged in as</p>
            <p className="text-sm font-bold truncate">{session.email}</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* HEADER */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
                <Clock size={14} /> Verification Queue
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Merchant Approvals</h1>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                <p className="text-2xl font-black text-slate-900">{pendingMerchants.length}</p>
             </div>
          </div>
        </header>

        {/* MERCHANT LIST */}
        <div className="grid gap-4">
          {pendingMerchants.length === 0 ? (
            <div className="bg-white rounded-[32px] p-20 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                    <CheckCircle size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Queue Clear!</h3>
                <p className="text-slate-500 max-w-xs">No merchants are currently waiting for KYC approval.</p>
            </div>
          ) : (
            pendingMerchants.map((merchant) => (
              <div
                key={merchant.id}
                className="group bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-6"
              >
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Building2 size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{merchant.legalName}</h3>
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                            <Mail size={14} className="text-slate-400" />
                            {merchant.user.email}
                        </div>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {merchant.tradeName || "No Trade Name"}
                        </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                        View Documents
                    </button>
                    <form action={`/api/admin/approve-merchant`} method="POST" className="flex-1 md:flex-none">
                      <input type="hidden" name="merchantId" value={merchant.id} />
                      <button className="w-full px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-indigo-600 shadow-lg shadow-slate-200 transition-all active:scale-95">
                        Approve Merchant
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