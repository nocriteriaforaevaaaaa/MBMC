import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MerchantRedemptions() {
  const session = await getSessionUser();
  if (!session || session.role !== "MERCHANT") redirect("/login");

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.userId },
  });

  if (!merchant) redirect("/login");

  const redemptions = await prisma.redemption.findMany({
    where: {
      offer: { merchantId: merchant.id },
    },
    include: {
      offer: true,
    },
  });

  return (
    <main className="p-8">
      <h1 className="text-xl font-semibold mb-4">
        Redeemed Coupons
      </h1>

      {redemptions.map((r) => (
        <div key={r.id} className="border p-3 rounded mb-2">
          <p className="font-mono">{r.tokenId}</p>
          <p className="text-sm text-slate-600">
            Offer: {r.offer.title}
          </p>
        </div>
      ))}
    </main>
  );
}
