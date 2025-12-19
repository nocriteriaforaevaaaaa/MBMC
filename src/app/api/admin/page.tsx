import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const merchants = await prisma.merchant.findMany({
    where: { kycStatus: "PENDING" },
    include: { user: true },
  });

  return (
    <main className="p-8">
      <h1 className="text-xl font-semibold mb-4">
        Pending Merchant Approvals
      </h1>

      {merchants.map((m) => (
        <form
          key={m.id}
          action="/api/admin/merchants/approve"
          method="POST"
          className="mb-4 border p-4 rounded"
        >
          <input type="hidden" name="merchantId" value={m.id} />
          <p className="font-medium">{m.tradeName || m.legalName}</p>
          <p className="text-sm text-slate-600">{m.user.email}</p>
          <button className="underline mt-2">
            Approve merchant
          </button>
        </form>
      ))}
    </main>
  );
}
