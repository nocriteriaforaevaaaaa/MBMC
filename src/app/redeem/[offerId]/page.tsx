import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import RedeemClient from "./RedeemClient";

export default async function RedeemPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;

  // 🔐 auth check
  const session = await getSessionUser();
  if (!session || session.role !== "STUDENT") {
    redirect("/login");
  }

  // 🔎 fetch offer
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
  });

  if (!offer || offer.status !== "ACTIVE") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold text-slate-700">
          Offer not available
        </h1>
      </main>
    );
  }

  // 🎟️ generate coupon (display only)
  const couponCode =
    offer.codeTemplate ??
    `EDU-${offer.id.slice(-6).toUpperCase()}`;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full space-y-6">
        <div>
          <h1 className="text-xl font-semibold mb-1">
            {offer.title}
          </h1>
          <p className="text-slate-600 text-sm">
            {offer.description}
          </p>
        </div>

        {/* Coupon display */}
        <div className="border rounded-lg p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">
            Your coupon code
          </p>
          <p className="text-lg font-mono font-semibold">
            {couponCode}
          </p>
        </div>

        {}
        <RedeemClient
        couponCode={couponCode}
          redirectUrl={offer.redirectUrl}
        />
      </div>
    </main>
  );
}
