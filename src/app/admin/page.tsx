import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/admin/login");
  }

  if (session.role !== "ADMIN") {
    redirect("/login");
  }

  const pendingMerchants = await prisma.merchant.findMany({
    where: { kycStatus: "PENDING" },
    include: { user: true },
  });

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Pending Merchant Requests
      </h1>
  
      {pendingMerchants.length === 0 && (
        <p className="text-slate-600">
          No pending merchant requests.
        </p>
      )}
  
      <div className="space-y-4">
        {pendingMerchants.map((merchant) => (
          <div
            key={merchant.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{merchant.legalName}</p>
              <p className="text-sm text-slate-600">
                {merchant.user.email}
              </p>
            </div>
  
            <form action={`/api/admin/approve-merchant`} method="POST">
              <input type="hidden" name="merchantId" value={merchant.id} />
              <button className="px-4 py-2 bg-green-600 text-white rounded">
                Approve
              </button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
  
}
