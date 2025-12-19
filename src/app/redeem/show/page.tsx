import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import crypto from "crypto";

export default async function RedeemPage({
  searchParams,
}: {
  searchParams: { offerId?: string };
}) {
  const session = await getSessionUser();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const offerId = searchParams.offerId;
  if (!offerId) redirect("/dashboard");

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
  });

  if (!offer || offer.status !== "ACTIVE") redirect("/dashboard");

  // ✅ generate coupon code
  const code = crypto.randomBytes(4).toString("hex").toUpperCase();

  // ✅ store redemption
  await prisma.redemption.create({
    data: {
      offerId: offer.id,
      studentId: session.userId,
      tokenId: code,
    },
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-xl shadow p-8 max-w-md text-center">
        <h1 className="text-xl font-semibold mb-4">
          Your discount code
        </h1>

        <div className="text-3xl font-mono tracking-widest bg-slate-100 border rounded-lg py-4 mb-4">
          {code}
        </div>

        <form action="/redeem/redirect" method="POST">
          <input type="hidden" name="code" value={code} />
          <input
            type="hidden"
            name="next"
            value={offer.redirectUrl}
          />

          <button className="w-full bg-indigo-600 text-white py-2 rounded">
            Redeem code
          </button>
        </form>
      </div>
    </main>
  );
}
